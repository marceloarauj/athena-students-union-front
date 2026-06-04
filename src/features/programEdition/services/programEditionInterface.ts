import {
  ProgramEdition, CurriculumEntry, Enrollment, ProgramPeriod,
  ClassGroup, ProgressRecord, ConflictReport, PublishChecklist,
  CalendarSummary, PromotionResult, ScheduleSlotAssignment,
  CreateProgramEditionDto, UpsertCurriculumEntryDto, EnrollStudentDto,
  CreatePeriodDto, CreateClassGroupDto, GenerateClassGroupsDto,
  RecordProgressDto, RunPromotionDto, OverrideScheduleSlotDto,
} from '../models/programEditionModel';
import { ProgramEditionMockService } from './programEditionMockService';
import { ProgramEditionService } from './programEditionService';
import { isMock } from '@/lib/serviceFactory';

export interface IProgramEditionService {
  // Edition CRUD
  listByProgram(programId: string): Promise<ProgramEdition[]>;
  get(id: string): Promise<ProgramEdition>;
  create(dto: CreateProgramEditionDto): Promise<ProgramEdition>;

  // Curriculum
  listCurriculum(editionId: string, gradeOrYear?: number): Promise<CurriculumEntry[]>;
  upsertCurriculumEntry(editionId: string, dto: UpsertCurriculumEntryDto): Promise<CurriculumEntry>;
  bulkUpsertCurriculum(editionId: string, entries: UpsertCurriculumEntryDto[]): Promise<CurriculumEntry[]>;

  // Enrollments
  listEnrollments(editionId: string): Promise<Enrollment[]>;
  enrollStudent(editionId: string, dto: EnrollStudentDto): Promise<Enrollment>;
  bulkEnroll(editionId: string, students: EnrollStudentDto[]): Promise<Enrollment[]>;
  updateEnrollmentStatus(editionId: string, enrollmentId: string, status: number): Promise<Enrollment>;

  // Periods
  listPeriods(editionId: string): Promise<ProgramPeriod[]>;
  generatePeriods(editionId: string): Promise<ProgramPeriod[]>;
  createPeriod(editionId: string, dto: CreatePeriodDto): Promise<ProgramPeriod>;

  // Calendar
  generateCalendar(editionId: string): Promise<void>;
  getCalendarSummary(editionId: string): Promise<CalendarSummary>;

  // Class Groups
  listClassGroups(editionId: string): Promise<ClassGroup[]>;
  getClassGroup(editionId: string, groupId: string): Promise<ClassGroup>;
  createClassGroup(editionId: string, dto: CreateClassGroupDto): Promise<ClassGroup>;
  generateClassGroups(editionId: string, dto: GenerateClassGroupsDto): Promise<ClassGroup[]>;
  assignStudentsToGroups(editionId: string): Promise<void>;

  // Schedule
  generateSchedule(editionId: string): Promise<void>;
  getClassGroupSchedule(editionId: string, groupId: string): Promise<ScheduleSlotAssignment[]>;
  getTeacherSchedule(editionId: string, teacherId: string): Promise<ScheduleSlotAssignment[]>;

  // Conflict
  runConflictDetection(editionId: string): Promise<ConflictReport>;
  getConflictReport(editionId: string): Promise<ConflictReport>;
  overrideScheduleSlot(editionId: string, scheduleId: string, dto: OverrideScheduleSlotDto): Promise<void>;

  // Progress
  listProgress(editionId: string): Promise<ProgressRecord[]>;
  recordProgress(dto: RecordProgressDto): Promise<ProgressRecord>;
  bulkRecordProgress(editionId: string, periodId: string, records: RecordProgressDto[]): Promise<ProgressRecord[]>;
  getPromotionPreview(editionId: string, targetEditionId: string): Promise<PromotionResult>;
  runPromotion(editionId: string, dto: RunPromotionDto): Promise<PromotionResult>;

  // Publishing
  getPublishChecklist(editionId: string): Promise<PublishChecklist>;
  publish(editionId: string): Promise<ProgramEdition>;
  close(editionId: string): Promise<ProgramEdition>;
}

export function getProgramEditionService(institution: string): IProgramEditionService {
  return isMock(institution) ? new ProgramEditionMockService() : new ProgramEditionService();
}
