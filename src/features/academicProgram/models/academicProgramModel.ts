export type ProgramType = 1 | 2 | 3; // School | Course | PostGraduate
export type PeriodType = 0 | 1 | 2 | 3 | 4; // Annual | Bimester | Trimester | Semester | Module

export const PROGRAM_TYPE_LABELS: Record<ProgramType, string> = {
  1: 'Escola',
  2: 'Curso',
  3: 'Pós-Graduação',
};

export const PERIOD_TYPE_LABELS: Record<PeriodType, string> = {
  0: 'Anual',
  1: 'Bimestral',
  2: 'Trimestral',
  3: 'Semestral',
  4: 'Modular',
};

export type AcademicProgram = {
  id: string;
  name: string;
  type: ProgramType;
  periodType: PeriodType;
  hasWeeklySchedule: boolean;
  durationYears: number;
  minCompletionPercent?: number | null;
  minSchoolDays?: number | null;
  isActive: boolean;
  createdAt: string;
};

export type CreateAcademicProgramDto = {
  name: string;
  type: ProgramType;
  periodType: PeriodType;
  hasWeeklySchedule: boolean;
  durationYears: number;
  minCompletionPercent?: number | null;
  minSchoolDays?: number | null;
};
