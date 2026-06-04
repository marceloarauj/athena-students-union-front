'use client';

import { useEffect, useState } from 'react';
import { AttendanceData, AttendanceStudent } from '../models/attendanceModel';
import { getAttendanceService } from '../services/attendanceInterface';

export function useAttendance(institution: string) {
  const [data, setData] = useState<AttendanceData | null>(null);
  const [students, setStudents] = useState<AttendanceStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState<number>(1);

  useEffect(() => {
    const service = getAttendanceService(institution);
    service.getAttendanceData().then(result => {
      setData(result);
      setStudents(result.students.map(s => ({ ...s })));
      setLoading(false);
    });
  }, [institution]);

  function updateStudentStatus(id: number, status: AttendanceStudent['status']) {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, status } : s)));
  }

  function markAllPresent() {
    setStudents(prev => prev.map(s => ({ ...s, status: 'present' })));
  }

  return {
    classes: data?.classes ?? [],
    students,
    loading,
    selectedClassId,
    setSelectedClassId,
    updateStudentStatus,
    markAllPresent,
  };
}
