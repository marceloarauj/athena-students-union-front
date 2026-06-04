import type { IFormulaService } from './formulaInterface';
import type { FormulaVariable, FormulaEntry } from '../models/formulaModel';
import variablesData from '@/seeds/formula_variables.json';
import formulasData from '@/seeds/formula_list.json';

export class FormulaMockService implements IFormulaService {
  private variables: FormulaVariable[] = variablesData as FormulaVariable[];
  private formulas: FormulaEntry[] = formulasData as FormulaEntry[];

  async getVariables(): Promise<FormulaVariable[]> {
    return [...this.variables];
  }

  async saveVariables(vars: FormulaVariable[]): Promise<FormulaVariable[]> {
    this.variables = vars;
    return [...this.variables];
  }

  async getFormulas(): Promise<FormulaEntry[]> {
    return [...this.formulas];
  }

  async saveFormula(f: Omit<FormulaEntry, 'id'> | FormulaEntry): Promise<FormulaEntry> {
    if ('id' in f) {
      this.formulas = this.formulas.map(x => (x.id === f.id ? f : x));
      return f;
    }
    const newEntry: FormulaEntry = { ...f, id: this.formulas.length + 1 };
    this.formulas.push(newEntry);
    return newEntry;
  }

  async deleteFormula(id: number): Promise<void> {
    this.formulas = this.formulas.filter(x => x.id !== id);
  }

  async setPrimaryFormula(id: number): Promise<void> {
    this.formulas = this.formulas.map(f => ({ ...f, isPrimary: f.id === id }));
  }
}
