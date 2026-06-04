'use client';

import { useEffect, useState } from 'react';
import { AcademicProgram, CreateAcademicProgramDto } from '../models/academicProgramModel';
import { getAcademicProgramService } from '../services/academicProgramInterface';
import { toast } from 'sonner';

export function useAcademicProgram(institution: string) {
  const [programs, setPrograms] = useState<AcademicProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const service = getAcademicProgramService(institution);

  useEffect(() => {
    service.list().then(data => {
      setPrograms(data);
      setLoading(false);
    });
  }, [institution]);

  async function createProgram(dto: CreateAcademicProgramDto) {
    const created = await service.create(dto);
    setPrograms(prev => [...prev, created]);
    toast.success('Programa acadêmico criado.');
    return created;
  }

  return { programs, loading, createProgram };
}
