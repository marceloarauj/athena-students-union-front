import { ITeacherService } from './teacherInterface';
import { Teacher, TeacherAvailability, CreateTeacherDto, SetTeacherSubjectsDto, SetTeacherAvailabilityDto } from '../models/teacherModel';
import data from '@/seeds/teachers_data.json';

let store: Teacher[] = data as Teacher[];

export class TeacherMockService implements ITeacherService {
  async list(): Promise<Teacher[]> {
    return store;
  }

  async create(dto: CreateTeacherDto): Promise<Teacher> {
    const teacher: Teacher = {
      ...dto,
      id: crypto.randomUUID(),
      isActive: true,
      createdAt: new Date().toISOString(),
      subjects: [],
      availability: [],
    };
    store = [...store, teacher];
    return teacher;
  }

  async setSubjects(teacherId: string, dto: SetTeacherSubjectsDto): Promise<void> {
    store = store.map(t => t.id === teacherId ? { ...t, subjects: dto.subjectIds } : t);
  }

  async setAvailability(teacherId: string, dto: SetTeacherAvailabilityDto): Promise<TeacherAvailability[]> {
    const avail: TeacherAvailability[] = dto.availabilities.map(a => ({
      id: crypto.randomUUID(),
      teacherId,
      dayOfWeek: a.dayOfWeek,
      shiftId: a.shiftId,
    }));
    store = store.map(t => t.id === teacherId ? { ...t, availability: avail } : t);
    return avail;
  }

  async getAvailability(teacherId: string): Promise<TeacherAvailability[]> {
    const teacher = store.find(t => t.id === teacherId);
    return teacher?.availability ?? [];
  }
}
