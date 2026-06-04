import { IGradeEntryService } from './gradeEntryInterface';
import { StudentGrades, ClassStudentGrade, ClassGrades } from '../models/gradeEntryModel';
import rawData from '@/seeds/grade_entry_data.json';

export class GradeEntryMockService implements IGradeEntryService {
  private classGradesData: ClassGrades[] = JSON.parse(JSON.stringify(rawData)) as ClassGrades[];

  async getStudents(): Promise<StudentGrades[]> {
    return [];
  }

  async saveGrades(_students: StudentGrades[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async getClassGrades(classId: number): Promise<ClassGrades> {
    const found = this.classGradesData.find(c => c.classId === classId);
    if (found) return JSON.parse(JSON.stringify(found)) as ClassGrades;
    return { classId, students: [] };
  }

  async saveClassGrades(classId: number, students: ClassStudentGrade[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const idx = this.classGradesData.findIndex(c => c.classId === classId);
    if (idx >= 0) {
      this.classGradesData[idx].students = students;
    } else {
      this.classGradesData.push({ classId, students });
    }
  }
}
