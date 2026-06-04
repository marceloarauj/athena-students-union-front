import { ITeacherService } from './teacherInterface';
import { Teacher, TeacherAvailability, CreateTeacherDto, SetTeacherSubjectsDto, SetTeacherAvailabilityDto } from '../models/teacherModel';

export class TeacherService implements ITeacherService {
  async list(): Promise<Teacher[]> {
    const res = await fetch('/api/teacher');
    if (!res.ok) return [];
    return res.json();
  }

  async create(dto: CreateTeacherDto): Promise<Teacher> {
    const res = await fetch('/api/teacher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    return res.json();
  }

  async setSubjects(teacherId: string, dto: SetTeacherSubjectsDto): Promise<void> {
    await fetch(`/api/teacher/${teacherId}/subjects`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subjectIds: dto.subjectIds }),
    });
  }

  async setAvailability(teacherId: string, dto: SetTeacherAvailabilityDto): Promise<TeacherAvailability[]> {
    const res = await fetch(`/api/teacher/${teacherId}/availability`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ availabilities: dto.availabilities }),
    });
    return res.json();
  }

  async getAvailability(teacherId: string): Promise<TeacherAvailability[]> {
    const res = await fetch(`/api/teacher/${teacherId}/availability`);
    if (!res.ok) return [];
    return res.json();
  }
}
