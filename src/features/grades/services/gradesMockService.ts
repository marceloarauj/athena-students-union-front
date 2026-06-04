import { IGradesService } from './gradesInterface';
import { GradeReport } from '../models/gradeModel';
import data from '@/seeds/grades_data.json';

export class GradesMockService implements IGradesService {
  async getGrades(): Promise<GradeReport[]> {
    return data as GradeReport[];
  }
}
