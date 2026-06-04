'use client';

import { useEffect, useState } from 'react';
import { StudentGrades } from '../models/gradeEntryModel';
import { getGradeEntryService } from '../services/gradeEntryInterface';

export function useGradeEntry(institution: string) {
  const [students, setStudents] = useState<StudentGrades[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState('3A');

  useEffect(() => {
    const service = getGradeEntryService(institution);
    service.getStudents().then(data => {
      setStudents(data);
      setLoading(false);
    });
  }, [institution]);

  function updateGrade(studentId: number, subjectId: number, bimestre: string, value: number | null) {
    setStudents(prev =>
      prev.map(s =>
        s.id === studentId
          ? {
              ...s,
              subjects: s.subjects.map(sub =>
                sub.id === subjectId ? { ...sub, [bimestre]: value } : sub
              ),
            }
          : s
      )
    );
  }

  async function saveAll() {
    setSaving(true);
    const service = getGradeEntryService(institution);
    await service.saveGrades(students);
    setSaving(false);
  }

  return { students, loading, saving, selectedTurma, setSelectedTurma, updateGrade, saveAll };
}
