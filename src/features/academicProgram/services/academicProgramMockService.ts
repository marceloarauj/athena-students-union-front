import { IAcademicProgramService } from './academicProgramInterface';
import { AcademicProgram, CreateAcademicProgramDto } from '../models/academicProgramModel';
import data from '@/seeds/academic_programs_data.json';

let store: AcademicProgram[] = data as AcademicProgram[];

export class AcademicProgramMockService implements IAcademicProgramService {
  async list(): Promise<AcademicProgram[]> {
    return store;
  }

  async get(id: string): Promise<AcademicProgram> {
    const found = store.find(p => p.id === id);
    if (!found) throw new Error('Programa não encontrado');
    return found;
  }

  async create(dto: CreateAcademicProgramDto): Promise<AcademicProgram> {
    const program: AcademicProgram = {
      ...dto,
      id: crypto.randomUUID(),
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    store = [...store, program];
    return program;
  }
}
