'use client';

import { useEffect, useState } from 'react';
import { RoleModel } from '../models/roleModel';
import { getRolesService } from '../services/rolesInterface';

export function useRoles(institution: string) {
  const [roles, setRoles] = useState<RoleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const service = getRolesService(institution);

  useEffect(() => {
    service.getRoles().then(data => {
      setRoles(data);
      setLoading(false);
    });
  }, [institution]);

  async function deleteRole(id: number) {
    await service.deleteRole(id);
    setRoles(prev => prev.filter(r => r.id !== id));
  }

  async function saveRole(role: RoleModel | Omit<RoleModel, 'id'>) {
    if ('id' in role) {
      const updated = await service.updateRole(role);
      setRoles(prev => prev.map(r => (r.id === updated.id ? updated : r)));
    } else {
      const created = await service.createRole(role);
      setRoles(prev => [...prev, created]);
    }
  }

  return { roles, loading, deleteRole, saveRole };
}
