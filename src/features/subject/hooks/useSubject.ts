'use client';

import { useEffect, useState } from 'react';
import { Subject, CreateSubjectDto } from '../models/subjectModel';
import { getSubjectService } from '../services/subjectInterface';
import { toast } from 'sonner';

export function useSubject(institution: string, programId: string) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const service = getSubjectService(institution);

  useEffect(() => {
    if (!programId) return;
    setLoading(true);
    service.listByProgram(programId).then(data => {
      setSubjects(data);
      setLoading(false);
    });
  }, [institution, programId]);

  async function createSubject(dto: CreateSubjectDto) {
    const created = await service.create(dto);
    setSubjects(prev => [...prev, created]);
    toast.success('Matéria criada.');
    return created;
  }

  return { subjects, loading, createSubject };
}
