import { StudentGrades, ClassStudentGrade, ClassGrades } from '../models/gradeEntryModel';
import { GradeEntryMockService } from './gradeEntryMockService';
import { GradeEntryService } from './gradeEntryService';
import { isMock } from '@/lib/serviceFactory';

export interface IGradeEntryService {
  getStudents(): Promise<StudentGrades[]>;
  saveGrades(students: StudentGrades[]): Promise<void>;
  getClassGrades(classId: number): Promise<ClassGrades>;
  saveClassGrades(classId: number, students: ClassStudentGrade[]): Promise<void>;
}

export function getGradeEntryService(institution: string): IGradeEntryService {
  return isMock(institution) ? new GradeEntryMockService() : new GradeEntryService();
}
