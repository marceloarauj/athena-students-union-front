import { Subject, CreateSubjectDto } from '../models/subjectModel';
import { SubjectMockService } from './subjectMockService';
import { SubjectService } from './subjectService';
import { isMock } from '@/lib/serviceFactory';

export interface ISubjectService {
  listByProgram(programId: string): Promise<Subject[]>;
  create(dto: CreateSubjectDto): Promise<Subject>;
}

export function getSubjectService(institution: string): ISubjectService {
  return isMock(institution) ? new SubjectMockService() : new SubjectService();
}
