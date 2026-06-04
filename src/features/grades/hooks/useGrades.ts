'use client';

import { useEffect, useState } from 'react';
import { GradeReport } from '../models/gradeModel';
import { getGradesService } from '../services/gradesInterface';

export function useGrades(institution: string) {
  const [grades, setGrades] = useState<GradeReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const service = getGradesService(institution);
    service.getGrades().then(data => {
      setGrades(data);
      setLoading(false);
    });
  }, [institution]);

  return { grades, loading };
}
