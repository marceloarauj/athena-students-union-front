'use client';

import { useEffect, useState } from 'react';
import { DayLesson, DayLessonStudent, AttendanceStatus } from '../models/dayLessonModel';
import { getDayLessonService } from '../services/dayLessonInterface';
import { toast } from 'sonner';

function today() {
  return new Date().toISOString().split('T')[0];
}

export function useDayLesson(institution: string, classId: number) {
  const [lesson, setLesson] = useState<DayLesson | null>(null);
  const [date, setDate] = useState(today());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    const service = getDayLessonService(institution);
    service.getDayLesson(classId, date).then(data => {
      setLesson(data ?? { classId, date, contents: [], students: [] });
      setLoading(false);
    });
  }, [institution, classId, date]);

  function addContent(text: string) {
    if (!text.trim() || !lesson) return;
    setLesson(prev => prev ? { ...prev, contents: [...prev.contents, text.trim()] } : prev);
  }

  function removeContent(idx: number) {
    setLesson(prev => prev ? { ...prev, contents: prev.contents.filter((_, i) => i !== idx) } : prev);
  }

  function updateStudentStatus(studentId: number, status: AttendanceStatus) {
    setLesson(prev =>
      prev ? {
        ...prev,
        students: prev.students.map(s => s.studentId === studentId ? { ...s, status } : s),
      } : prev
    );
  }

  function markAllPresent() {
    setLesson(prev =>
      prev ? { ...prev, students: prev.students.map(s => ({ ...s, status: 'present' as AttendanceStatus })) } : prev
    );
  }

  async function save() {
    if (!lesson) return;
    setSaving(true);
    const service = getDayLessonService(institution);
    await service.saveDayLesson({ ...lesson, date });
    setSaving(false);
    toast.success('Aula salva com sucesso!');
  }

  return { lesson, date, setDate, loading, saving, addContent, removeContent, updateStudentStatus, markAllPresent, save };
}
