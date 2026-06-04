'use client';
import { useEffect, useState } from 'react';
import type { FormulaVariable } from '../models/formulaModel';
import { getFormulaService } from '../services/formulaInterface';

export function useFormulaVariables(institution: string) {
  const [variables, setVariables] = useState<FormulaVariable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const service = getFormulaService(institution);
    service.getVariables().then(result => {
      setVariables(result);
      setLoading(false);
    });
  }, [institution]);

  return { variables, loading };
}
