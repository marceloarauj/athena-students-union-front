'use client';

import { useEffect, useState } from 'react';
import { Discipline } from '../models/disciplineModel';
import { getDisciplinesService } from '../services/disciplinesInterface';
import { toast } from 'sonner';

export function useDisciplines(institution: string) {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);
  const service = getDisciplinesService(institution);

  useEffect(() => {
    service.getDisciplines().then(data => {
      setDisciplines(data);
      setLoading(false);
    });
  }, [institution]);

  async function deleteDiscipline(id: number) {
    await service.deleteDiscipline(id);
    setDisciplines(prev => prev.filter(d => d.id !== id));
    toast.success('Disciplina removida.');
  }

  async function saveDiscipline(d: Discipline | Omit<Discipline, 'id'>) {
    if ('id' in d) {
      const updated = await service.updateDiscipline(d);
      setDisciplines(prev => prev.map(x => (x.id === updated.id ? updated : x)));
      toast.success('Disciplina atualizada.');
    } else {
      const created = await service.createDiscipline(d);
      setDisciplines(prev => [...prev, created]);
      toast.success('Disciplina criada.');
    }
  }

  return { disciplines, loading, deleteDiscipline, saveDiscipline };
}
