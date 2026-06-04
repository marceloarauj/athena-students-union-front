import { IGradeEntryService } from './gradeEntryInterface';
import { StudentGrades, ClassStudentGrade, ClassGrades } from '../models/gradeEntryModel';

export class GradeEntryService implements IGradeEntryService {
  async getStudents(): Promise<StudentGrades[]> {
    const response = await fetch('/api/grade-entry/students');
    return response.json();
  }

  async saveGrades(students: StudentGrades[]): Promise<void> {
    await fetch('/api/grade-entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(students),
    });
  }

  async getClassGrades(classId: number): Promise<ClassGrades> {
    const response = await fetch(`/api/grade-entry/class/${classId}`);
    return response.json();
  }

  async saveClassGrades(classId: number, students: ClassStudentGrade[]): Promise<void> {
    await fetch(`/api/grade-entry/class/${classId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(students),
    });
  }
}
