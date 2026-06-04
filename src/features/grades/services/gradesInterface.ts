import { GradeReport } from '../models/gradeModel';
import { GradesMockService } from './gradesMockService';
import { GradesService } from './gradesService';
import { isMock } from '@/lib/serviceFactory';

export interface IGradesService {
  getGrades(): Promise<GradeReport[]>;
}

export function getGradesService(institution: string): IGradesService {
  return isMock(institution) ? new GradesMockService() : new GradesService();
}
