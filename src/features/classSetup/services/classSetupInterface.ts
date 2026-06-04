import { SchoolClass } from '../models/classSetupModel';
import { ClassSetupMockService } from './classSetupMockService';
import { ClassSetupService } from './classSetupService';
import { isMock } from '@/lib/serviceFactory';

export interface IClassSetupService {
  getClasses(): Promise<SchoolClass[]>;
  createClass(c: Omit<SchoolClass, 'id'>): Promise<SchoolClass>;
  updateClass(c: SchoolClass): Promise<SchoolClass>;
  deleteClass(id: number): Promise<void>;
}

export function getClassSetupService(institution: string): IClassSetupService {
  return isMock(institution) ? new ClassSetupMockService() : new ClassSetupService();
}
