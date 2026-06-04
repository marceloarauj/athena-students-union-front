'use client';

import { useEffect, useState } from 'react';
import { ClassStudentGrade } from '../models/gradeEntryModel';
import { getGradeEntryService } from '../services/gradeEntryInterface';
import { toast } from 'sonner';

export function useClassGradeEntry(institution: string, classId: number) {
  const [students, setStudents] = useState<ClassStudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    const service = getGradeEntryService(institution);
    service.getClassGrades(classId).then(data => {
      setStudents(data.students);
      setLoading(false);
    });
  }, [institution, classId]);

  function updateGrade(studentId: number, bimestre: 'b1' | 'b2' | 'b3' | 'b4', value: number | null) {
    setStudents(prev =>
      prev.map(s => (s.studentId === studentId ? { ...s, [bimestre]: value } : s))
    );
  }

  async function saveAll() {
    setSaving(true);
    const service = getGradeEntryService(institution);
    await service.saveClassGrades(classId, students);
    setSaving(false);
    toast.success('Notas salvas com sucesso!');
  }

  return { students, loading, saving, updateGrade, saveAll };
}
