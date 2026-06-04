import { IProgramEditionService } from './programEditionInterface';
import {
  ProgramEdition, CurriculumEntry, Enrollment, ProgramPeriod,
  ClassGroup, ProgressRecord, ConflictReport, PublishChecklist,
  CalendarSummary, PromotionResult, ScheduleSlotAssignment,
  CreateProgramEditionDto, UpsertCurriculumEntryDto, EnrollStudentDto,
  CreatePeriodDto, CreateClassGroupDto, GenerateClassGroupsDto,
  RecordProgressDto, RunPromotionDto, OverrideScheduleSlotDto,
} from '../models/programEditionModel';

const BASE = '/api/programedition';

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export class ProgramEditionService implements IProgramEditionService {
  async listByProgram(programId: string): Promise<ProgramEdition[]> {
    const res = await fetch(`${BASE}/${programId}`);
    if (!res.ok) return [];
    return res.json();
  }

  async get(id: string): Promise<ProgramEdition> {
    return json(await fetch(`${BASE}/edition/${id}`));
  }

  async create(dto: CreateProgramEditionDto): Promise<ProgramEdition> {
    return json(await fetch(BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) }));
  }

  async listCurriculum(editionId: string, gradeOrYear?: number): Promise<CurriculumEntry[]> {
    const url = gradeOrYear ? `${BASE}/edition/${editionId}/curriculum?gradeOrYear=${gradeOrYear}` : `${BASE}/edition/${editionId}/curriculum`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return res.json();
  }

  async upsertCurriculumEntry(editionId: string, dto: UpsertCurriculumEntryDto): Promise<CurriculumEntry> {
    return json(await fetch(`${BASE}/edition/${editionId}/curriculum/entry`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) }));
  }

  async bulkUpsertCurriculum(editionId: string, entries: UpsertCurriculumEntryDto[]): Promise<CurriculumEntry[]> {
    return json(await fetch(`${BASE}/edition/${editionId}/curriculum`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ entries }) }));
  }

  async listEnrollments(editionId: string): Promise<Enrollment[]> {
    const res = await fetch(`${BASE}/edition/${editionId}/enrollments`);
    if (!res.ok) return [];
    return res.json();
  }

  async enrollStudent(editionId: string, dto: EnrollStudentDto): Promise<Enrollment> {
    return json(await fetch(`${BASE}/edition/${editionId}/enroll`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) }));
  }

  async bulkEnroll(editionId: string, students: EnrollStudentDto[]): Promise<Enrollment[]> {
    return json(await fetch(`${BASE}/edition/${editionId}/enroll/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ students }) }));
  }

  async updateEnrollmentStatus(editionId: string, enrollmentId: string, status: number): Promise<Enrollment> {
    return json(await fetch(`${BASE}/edition/${editionId}/enrollments/${enrollmentId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }));
  }

  async listPeriods(editionId: string): Promise<ProgramPeriod[]> {
    const res = await fetch(`${BASE}/edition/${editionId}/periods`);
    if (!res.ok) return [];
    return res.json();
  }

  async generatePeriods(editionId: string): Promise<ProgramPeriod[]> {
    return json(await fetch(`${BASE}/edition/${editionId}/generate-periods`, { method: 'POST' }));
  }

  async createPeriod(editionId: string, dto: CreatePeriodDto): Promise<ProgramPeriod> {
    return json(await fetch(`${BASE}/edition/${editionId}/periods`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) }));
  }

  async generateCalendar(editionId: string): Promise<void> {
    await fetch(`${BASE}/edition/${editionId}/generate-calendar`, { method: 'POST' });
  }

  async getCalendarSummary(editionId: string): Promise<CalendarSummary> {
    return json(await fetch(`${BASE}/edition/${editionId}/calendar/summary`));
  }

  async listClassGroups(editionId: string): Promise<ClassGroup[]> {
    const res = await fetch(`${BASE}/edition/${editionId}/class-groups`);
    if (!res.ok) return [];
    return res.json();
  }

  async getClassGroup(editionId: string, groupId: string): Promise<ClassGroup> {
    return json(await fetch(`${BASE}/edition/${editionId}/class-groups/${groupId}`));
  }

  async createClassGroup(editionId: string, dto: CreateClassGroupDto): Promise<ClassGroup> {
    return json(await fetch(`${BASE}/edition/${editionId}/class-groups`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) }));
  }

  async generateClassGroups(editionId: string, dto: GenerateClassGroupsDto): Promise<ClassGroup[]> {
    return json(await fetch(`${BASE}/edition/${editionId}/class-groups/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) }));
  }

  async assignStudentsToGroups(editionId: string): Promise<void> {
    await fetch(`${BASE}/edition/${editionId}/class-groups/assign-students`, { method: 'POST' });
  }

  async generateSchedule(editionId: string): Promise<void> {
    await fetch(`${BASE}/edition/${editionId}/generate-schedule`, { method: 'POST' });
  }

  async getClassGroupSchedule(editionId: string, groupId: string): Promise<ScheduleSlotAssignment[]> {
    const res = await fetch(`${BASE}/edition/${editionId}/class-groups/${groupId}/schedule`);
    if (!res.ok) return [];
    return res.json();
  }

  async getTeacherSchedule(editionId: string, teacherId: string): Promise<ScheduleSlotAssignment[]> {
    const res = await fetch(`${BASE}/edition/${editionId}/teachers/${teacherId}/schedule`);
    if (!res.ok) return [];
    return res.json();
  }

  async runConflictDetection(editionId: string): Promise<ConflictReport> {
    return json(await fetch(`${BASE}/edition/${editionId}/conflict-detection`, { method: 'POST' }));
  }

  async getConflictReport(editionId: string): Promise<ConflictReport> {
    return json(await fetch(`${BASE}/edition/${editionId}/conflict-report`));
  }

  async overrideScheduleSlot(editionId: string, scheduleId: string, dto: OverrideScheduleSlotDto): Promise<void> {
    await fetch(`${BASE}/edition/${editionId}/schedule/${scheduleId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) });
  }

  async listProgress(editionId: string): Promise<ProgressRecord[]> {
    const res = await fetch(`${BASE}/edition/${editionId}/progress`);
    if (!res.ok) return [];
    return res.json();
  }

  async recordProgress(dto: RecordProgressDto): Promise<ProgressRecord> {
    return json(await fetch(`${BASE}/edition/progress/record`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) }));
  }

  async bulkRecordProgress(editionId: string, periodId: string, records: RecordProgressDto[]): Promise<ProgressRecord[]> {
    return json(await fetch(`${BASE}/edition/${editionId}/progress`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ programPeriodId: periodId, records }) }));
  }

  async getPromotionPreview(editionId: string, targetEditionId: string): Promise<PromotionResult> {
    return json(await fetch(`${BASE}/edition/${editionId}/promotion/preview?targetEditionId=${targetEditionId}`));
  }

  async runPromotion(editionId: string, dto: RunPromotionDto): Promise<PromotionResult> {
    return json(await fetch(`${BASE}/edition/${editionId}/promotion/run`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) }));
  }

  async getPublishChecklist(editionId: string): Promise<PublishChecklist> {
    return json(await fetch(`${BASE}/edition/${editionId}/publish-checklist`, { method: 'POST' }));
  }

  async publish(editionId: string): Promise<ProgramEdition> {
    return json(await fetch(`${BASE}/edition/${editionId}/publish`, { method: 'POST' }));
  }

  async close(editionId: string): Promise<ProgramEdition> {
    return json(await fetch(`${BASE}/edition/${editionId}/close`, { method: 'POST' }));
  }
}
