import { IAcademicProgramService } from './academicProgramInterface';
import { AcademicProgram, CreateAcademicProgramDto } from '../models/academicProgramModel';

export class AcademicProgramService implements IAcademicProgramService {
  async list(): Promise<AcademicProgram[]> {
    const res = await fetch('/api/academicprogram');
    if (!res.ok) return [];
    return res.json();
  }

  async get(id: string): Promise<AcademicProgram> {
    const res = await fetch(`/api/academicprogram/${id}`);
    if (!res.ok) throw new Error('Programa não encontrado');
    return res.json();
  }

  async create(dto: CreateAcademicProgramDto): Promise<AcademicProgram> {
    const res = await fetch('/api/academicprogram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: dto.name,
        type: dto.type,
        periodType: dto.periodType,
        hasWeeklySchedule: dto.hasWeeklySchedule,
        durationYears: dto.durationYears,
        minCompletionPercent: dto.minCompletionPercent ?? null,
        minSchoolDays: dto.minSchoolDays ?? null,
      }),
    });
    return res.json();
  }
}
