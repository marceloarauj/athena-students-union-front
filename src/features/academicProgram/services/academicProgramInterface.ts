import { AcademicProgram, CreateAcademicProgramDto } from '../models/academicProgramModel';
import { AcademicProgramMockService } from './academicProgramMockService';
import { AcademicProgramService } from './academicProgramService';
import { isMock } from '@/lib/serviceFactory';

export interface IAcademicProgramService {
  list(): Promise<AcademicProgram[]>;
  get(id: string): Promise<AcademicProgram>;
  create(dto: CreateAcademicProgramDto): Promise<AcademicProgram>;
}

export function getAcademicProgramService(institution: string): IAcademicProgramService {
  return isMock(institution) ? new AcademicProgramMockService() : new AcademicProgramService();
}
