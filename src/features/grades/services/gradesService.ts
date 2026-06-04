import { IGradesService } from './gradesInterface';
import { GradeReport } from '../models/gradeModel';

export class GradesService implements IGradesService {
  async getGrades(): Promise<GradeReport[]> {
    const response = await fetch('/api/grades');
    return response.json();
  }
}
