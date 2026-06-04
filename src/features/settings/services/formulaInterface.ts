import type { FormulaVariable, FormulaEntry } from '../models/formulaModel';
import { FormulaMockService } from './formulaMockService';
import { FormulaService } from './formulaService';
import { isMock } from '@/lib/serviceFactory';

export interface IFormulaService {
  getVariables(): Promise<FormulaVariable[]>;
  saveVariables(vars: FormulaVariable[]): Promise<FormulaVariable[]>;
  getFormulas(): Promise<FormulaEntry[]>;
  saveFormula(f: Omit<FormulaEntry, 'id'> | FormulaEntry): Promise<FormulaEntry>;
  deleteFormula(id: number): Promise<void>;
  setPrimaryFormula(id: number): Promise<void>;
}

export function getFormulaService(institution: string): IFormulaService {
  return isMock(institution) ? new FormulaMockService() : new FormulaService();
}
