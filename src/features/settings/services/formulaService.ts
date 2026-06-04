import type { IFormulaService } from './formulaInterface';
import type { FormulaVariable, FormulaEntry } from '../models/formulaModel';

export class FormulaService implements IFormulaService {
  async getVariables(): Promise<FormulaVariable[]> {
    const response = await fetch('/api/formula-variables');
    return response.json();
  }

  async saveVariables(vars: FormulaVariable[]): Promise<FormulaVariable[]> {
    const response = await fetch('/api/formula-variables', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vars),
    });
    return response.json();
  }

  async getFormulas(): Promise<FormulaEntry[]> {
    const response = await fetch('/api/formulas');
    return response.json();
  }

  async saveFormula(f: Omit<FormulaEntry, 'id'> | FormulaEntry): Promise<FormulaEntry> {
    const isUpdate = 'id' in f;
    const response = await fetch(isUpdate ? `/api/formulas/${(f as FormulaEntry).id}` : '/api/formulas', {
      method: isUpdate ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(f),
    });
    return response.json();
  }

  async deleteFormula(id: number): Promise<void> {
    await fetch(`/api/formulas/${id}`, { method: 'DELETE' });
  }

  async setPrimaryFormula(id: number): Promise<void> {
    await fetch(`/api/formulas/${id}/set-primary`, { method: 'PATCH' });
  }
}
