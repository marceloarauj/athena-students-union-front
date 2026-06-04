'use client';

import { useEffect, useState } from 'react';
import type { FormulaEntry, FormulaVariable } from '../models/formulaModel';
import { getFormulaService } from '../services/formulaInterface';
import { toast } from 'sonner';

export function useFormulas(institution: string) {
  const [formulas, setFormulas] = useState<FormulaEntry[]>([]);
  const [variables, setVariables] = useState<FormulaVariable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const service = getFormulaService(institution);
    Promise.all([service.getFormulas(), service.getVariables()]).then(([f, v]) => {
      setFormulas(f);
      setVariables(v);
      setLoading(false);
    });
  }, [institution]);

  async function saveFormula(f: Omit<FormulaEntry, 'id'> | FormulaEntry) {
    const service = getFormulaService(institution);
    const saved = await service.saveFormula(f);
    if ('id' in f) {
      setFormulas(prev => prev.map(x => (x.id === saved.id ? saved : x)));
      toast.success('Fórmula atualizada.');
    } else {
      setFormulas(prev => [...prev, saved]);
      toast.success('Fórmula cadastrada.');
    }
    return saved;
  }

  async function deleteFormula(id: number) {
    const service = getFormulaService(institution);
    await service.deleteFormula(id);
    setFormulas(prev => prev.filter(x => x.id !== id));
    toast.success('Fórmula removida.');
  }

  async function setPrimaryFormula(id: number) {
    const service = getFormulaService(institution);
    await service.setPrimaryFormula(id);
    setFormulas(prev => prev.map(f => ({ ...f, isPrimary: f.id === id })));
    toast.success('Fórmula principal definida.');
  }

  async function saveVariables(vars: FormulaVariable[]) {
    const service = getFormulaService(institution);
    const saved = await service.saveVariables(vars);
    setVariables(saved);
    toast.success('Variáveis salvas.');
  }

  return { formulas, variables, loading, saveFormula, deleteFormula, setPrimaryFormula, saveVariables };
}
