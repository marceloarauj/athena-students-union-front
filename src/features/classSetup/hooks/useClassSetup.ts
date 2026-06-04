'use client';

import { useEffect, useState } from 'react';
import { SchoolClass } from '../models/classSetupModel';
import { getClassSetupService } from '../services/classSetupInterface';
import { toast } from 'sonner';

export function useClassSetup(institution: string) {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const service = getClassSetupService(institution);

  useEffect(() => {
    service.getClasses().then(data => {
      setClasses(data);
      setLoading(false);
    });
  }, [institution]);

  async function deleteClass(id: number) {
    await service.deleteClass(id);
    setClasses(prev => prev.filter(c => c.id !== id));
    toast.success('Turma removida.');
  }

  async function saveClass(c: SchoolClass | Omit<SchoolClass, 'id'>) {
    if ('id' in c) {
      const updated = await service.updateClass(c);
      setClasses(prev => prev.map(x => (x.id === updated.id ? updated : x)));
      toast.success('Turma atualizada.');
    } else {
      const created = await service.createClass(c);
      setClasses(prev => [...prev, created]);
      toast.success('Turma criada.');
    }
  }

  return { classes, loading, deleteClass, saveClass };
}
