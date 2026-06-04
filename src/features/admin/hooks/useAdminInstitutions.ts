'use client';

import { useEffect, useState } from 'react';
import type { AdminInstitution } from '../models/adminInstitutionModel';
import type { AdminUserRegister } from '../models/adminUserModel';
import { getAdminService } from '../services/adminInterface';
import { toast } from 'sonner';

export function useAdminInstitutions() {
  const [institutions, setInstitutions] = useState<AdminInstitution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminService().getInstitutions().then(data => {
      setInstitutions(data);
      setLoading(false);
    });
  }, []);

  async function saveInstitution(i: Omit<AdminInstitution, 'id' | 'createdAt'> | AdminInstitution) {
    const service = getAdminService();
    if ('id' in i) {
      const updated = await service.updateInstitution(i);
      setInstitutions(prev => prev.map(x => (x.id === updated.id ? updated : x)));
      toast.success('Instituição atualizada.');
    } else {
      const created = await service.createInstitution(i);
      setInstitutions(prev => [...prev, created]);
      toast.success('Instituição cadastrada.');
    }
  }

  async function deleteInstitution(id: number) {
    await getAdminService().deleteInstitution(id);
    setInstitutions(prev => prev.filter(x => x.id !== id));
    toast.success('Instituição removida.');
  }

  async function registerAdminUser(institutionId: number, data: AdminUserRegister) {
    await getAdminService().registerAdminUser(institutionId, data);
    toast.success('Usuário administrador cadastrado com sucesso.');
  }

  return { institutions, loading, saveInstitution, deleteInstitution, registerAdminUser };
}
