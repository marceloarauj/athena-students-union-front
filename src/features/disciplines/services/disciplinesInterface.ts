import { Discipline } from '../models/disciplineModel';
import { DisciplinesMockService } from './disciplinesMockService';
import { DisciplinesService } from './disciplinesService';
import { isMock } from '@/lib/serviceFactory';

export interface IDisciplinesService {
  getDisciplines(): Promise<Discipline[]>;
  createDiscipline(d: Omit<Discipline, 'id'>): Promise<Discipline>;
  updateDiscipline(d: Discipline): Promise<Discipline>;
  deleteDiscipline(id: number): Promise<void>;
}

export function getDisciplinesService(institution: string): IDisciplinesService {
  return isMock(institution) ? new DisciplinesMockService() : new DisciplinesService();
}
