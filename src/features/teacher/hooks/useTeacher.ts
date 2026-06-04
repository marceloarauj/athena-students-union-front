'use client';

import { useEffect, useState } from 'react';
import { Teacher, CreateTeacherDto, SetTeacherSubjectsDto, SetTeacherAvailabilityDto } from '../models/teacherModel';
import { getTeacherService } from '../services/teacherInterface';
import { toast } from 'sonner';

export function useTeacher(institution: string) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const service = getTeacherService(institution);

  useEffect(() => {
    service.list().then(data => {
      setTeachers(data);
      setLoading(false);
    });
  }, [institution]);

  async function createTeacher(dto: CreateTeacherDto) {
    const created = await service.create(dto);
    setTeachers(prev => [...prev, created]);
    toast.success('Professor criado.');
    return created;
  }

  async function setSubjects(teacherId: string, dto: SetTeacherSubjectsDto) {
    await service.setSubjects(teacherId, dto);
    setTeachers(prev => prev.map(t => t.id === teacherId ? { ...t, subjects: dto.subjectIds } : t));
    toast.success('Disciplinas atualizadas.');
  }

  async function setAvailability(teacherId: string, dto: SetTeacherAvailabilityDto) {
    const avail = await service.setAvailability(teacherId, dto);
    setTeachers(prev => prev.map(t => t.id === teacherId ? { ...t, availability: avail } : t));
    toast.success('Disponibilidade atualizada.');
  }

  return { teachers, loading, createTeacher, setSubjects, setAvailability };
}
