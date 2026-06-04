import { IClassSetupService } from './classSetupInterface';
import { SchoolClass } from '../models/classSetupModel';

type BackendClassroom = {
  id: string;
  location: string;
  teacherId: string;
  startDate: string;
  endDate: string;
  disciplineId: string;
  disciplineName: string;
  maxStudents?: number;
};

function toSchoolClass(c: BackendClassroom, id: number): SchoolClass {
  return {
    id,
    name: c.location,
    discipline: c.disciplineName,
    teacher: c.teacherId, // back-end returns only Guid; name resolution tracked in TODO
    startDate: c.startDate.split('T')[0],
    endDate: c.endDate.split('T')[0],
    frequency: 'diaria', // not returned by back-end; tracked in TODO
    daysOfWeek: [],      // not returned by back-end; tracked in TODO
    totalClasses: c.maxStudents ?? 0,
  };
}

export class ClassSetupService implements IClassSetupService {
  async getClasses(): Promise<SchoolClass[]> {
    const response = await fetch('/api/classroom');
    if (!response.ok) return [];
    const data: BackendClassroom[] = await response.json();
    return data.map((c, idx) => toSchoolClass(c, idx + 1));
  }

  async createClass(c: Omit<SchoolClass, 'id'>): Promise<SchoolClass> {
    const response = await fetch('/api/classroom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        disciplineId: c.discipline, // expects Guid; pass discipline name until model aligned
        teacherId: c.teacher,       // expects Guid; pass teacher name until model aligned
        location: c.name,
        startDate: c.startDate,
        endDate: c.endDate,
        maxStudents: c.totalClasses || null,
        generateDayLessons: false,
      }),
    });
    const data: BackendClassroom = await response.json();
    return toSchoolClass(data, Date.now());
  }

  async updateClass(c: SchoolClass): Promise<SchoolClass> {
    // PUT /api/classroom/{id} not yet implemented in back-end; tracked in TODO
    const response = await fetch(`/api/classroom/${c.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: c.name,
        startDate: c.startDate,
        endDate: c.endDate,
        maxStudents: c.totalClasses || null,
      }),
    });
    const data: BackendClassroom = await response.json();
    return toSchoolClass(data, c.id);
  }

  async deleteClass(id: number): Promise<void> {
    // DELETE /api/classroom/{id} not yet implemented in back-end; tracked in TODO
    await fetch(`/api/classroom/${id}`, { method: 'DELETE' });
  }
}
