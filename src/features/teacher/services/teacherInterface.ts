import { Teacher, TeacherAvailability, CreateTeacherDto, SetTeacherSubjectsDto, SetTeacherAvailabilityDto } from '../models/teacherModel';
import { TeacherMockService } from './teacherMockService';
import { TeacherService } from './teacherService';
import { isMock } from '@/lib/serviceFactory';

export interface ITeacherService {
  list(): Promise<Teacher[]>;
  create(dto: CreateTeacherDto): Promise<Teacher>;
  setSubjects(teacherId: string, dto: SetTeacherSubjectsDto): Promise<void>;
  setAvailability(teacherId: string, dto: SetTeacherAvailabilityDto): Promise<TeacherAvailability[]>;
  getAvailability(teacherId: string): Promise<TeacherAvailability[]>;
}

export function getTeacherService(institution: string): ITeacherService {
  return isMock(institution) ? new TeacherMockService() : new TeacherService();
}
