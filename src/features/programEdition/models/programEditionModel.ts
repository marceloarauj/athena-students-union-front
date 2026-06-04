export type EditionStatus = 0 | 1 | 2 | 3; // Draft | Simulated | Published | Closed
export type EnrollmentStatus = 1 | 2 | 3 | 4; // Active | Suspended | Completed | Cancelled
export type ProgressStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const EDITION_STATUS_LABELS: Record<EditionStatus, string> = {
  0: 'Rascunho',
  1: 'Simulado',
  2: 'Publicado',
  3: 'Encerrado',
};

export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  1: 'Ativo',
  2: 'Suspenso',
  3: 'Concluído',
  4: 'Cancelado',
};

export const PROGRESS_STATUS_LABELS: Record<ProgressStatus, string> = {
  1: 'Aprovado',
  2: 'Reprovado',
  3: 'Concluído',
  4: 'Em Andamento',
  5: 'Não Iniciado',
  6: 'Promovido',
  7: 'Retido',
  8: 'Formado',
  9: 'Transferido',
};

export type ProgramEdition = {
  id: string;
  academicProgramId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: EditionStatus;
  publishedAt?: string | null;
  createdAt: string;
};

export type CurriculumEntry = {
  id: string;
  programEditionId: string;
  subjectId: string;
  gradeOrYear?: number | null;
  periodNumber?: number | null;
  weeklyHours?: number | null;
  totalHours?: number | null;
};

export type Enrollment = {
  id: string;
  studentId: string;
  programEditionId: string;
  gradeOrYear?: number | null;
  status: EnrollmentStatus;
  enrolledAt: string;
  purchaseReference?: string | null;
  expiresAt?: string | null;
};

export type ProgramPeriod = {
  id: string;
  programEditionId: string;
  number: number;
  name: string;
  startDate: string;
  endDate: string;
  schoolDays?: number | null;
};

export type ClassGroup = {
  id: string;
  programEditionId: string;
  name: string;
  gradeOrYear?: number | null;
  roomId?: string | null;
  shiftId?: string | null;
  maxStudents: number;
  studentCount: number;
};

export type ProgressRecord = {
  id: string;
  enrollmentId: string;
  programPeriodId: string;
  status: ProgressStatus;
  finalGrade?: number | null;
  completionPercent?: number | null;
  createdAt: string;
};

export type ConflictReport = {
  hasConflicts: boolean;
  conflicts: { description: string; type: string; affectedGroups: string[] }[];
};

export type PublishChecklist = {
  items: { label: string; passed: boolean; description?: string }[];
  canPublish: boolean;
};

export type CalendarSummary = {
  totalSchoolDays: number;
  totalHolidays: number;
  totalRecesses: number;
  workingDaysByMonth: Record<string, number>;
};

export type ScheduleSlotAssignment = {
  id: string;
  classGroupId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: number;
  scheduleSlotId: string;
};

export type PromotionResult = {
  promoted: number;
  retained: number;
  graduated: number;
  details: { enrollmentId: string; studentId: string; result: string }[];
};

// DTOs
export type CreateProgramEditionDto = {
  academicProgramId: string;
  name: string;
  startDate: string;
  endDate: string;
};

export type UpsertCurriculumEntryDto = {
  subjectId: string;
  gradeOrYear?: number | null;
  periodNumber?: number | null;
  weeklyHours?: number | null;
  totalHours?: number | null;
};

export type EnrollStudentDto = {
  studentId: string;
  gradeOrYear?: number | null;
  purchaseReference?: string | null;
  expiresAt?: string | null;
};

export type CreatePeriodDto = {
  number: number;
  name: string;
  startDate: string;
  endDate: string;
};

export type CreateClassGroupDto = {
  name: string;
  gradeOrYear?: number | null;
  roomId?: string | null;
  shiftId?: string | null;
  maxStudents: number;
};

export type GenerateClassGroupsDto = {
  groups: { gradeOrYear: number; numberOfGroups: number; roomId?: string | null; shiftId?: string | null; maxStudents: number }[];
};

export type RecordProgressDto = {
  enrollmentId: string;
  programPeriodId: string;
  status: ProgressStatus;
  finalGrade?: number | null;
  completionPercent?: number | null;
};

export type RunPromotionDto = {
  targetEditionId: string;
};

export type OverrideScheduleSlotDto = {
  classGroupId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: number;
  scheduleSlotId: string;
};
