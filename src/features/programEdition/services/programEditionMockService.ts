import { IProgramEditionService } from './programEditionInterface';
import {
  ProgramEdition, CurriculumEntry, Enrollment, ProgramPeriod,
  ClassGroup, ProgressRecord, ConflictReport, PublishChecklist,
  CalendarSummary, PromotionResult, ScheduleSlotAssignment,
  CreateProgramEditionDto, UpsertCurriculumEntryDto, EnrollStudentDto,
  CreatePeriodDto, CreateClassGroupDto, GenerateClassGroupsDto,
  RecordProgressDto, RunPromotionDto, OverrideScheduleSlotDto,
  EditionStatus,
} from '../models/programEditionModel';
import rawData from '@/seeds/program_edition_data.json';

let editions: ProgramEdition[] = rawData.editions as ProgramEdition[];
let curriculum: CurriculumEntry[] = rawData.curriculum as CurriculumEntry[];
let enrollments: Enrollment[] = rawData.enrollments as Enrollment[];
let periods: ProgramPeriod[] = rawData.periods as ProgramPeriod[];
let classGroups: ClassGroup[] = rawData.classGroups as ClassGroup[];
let progressRecords: ProgressRecord[] = rawData.progress as ProgressRecord[];
let scheduleSlots: ScheduleSlotAssignment[] = [];
let conflictReport: ConflictReport | null = null;

export class ProgramEditionMockService implements IProgramEditionService {
  async listByProgram(programId: string): Promise<ProgramEdition[]> {
    return editions.filter(e => e.academicProgramId === programId);
  }

  async get(id: string): Promise<ProgramEdition> {
    const found = editions.find(e => e.id === id);
    if (!found) throw new Error('Edição não encontrada');
    return found;
  }

  async create(dto: CreateProgramEditionDto): Promise<ProgramEdition> {
    const edition: ProgramEdition = {
      ...dto,
      id: crypto.randomUUID(),
      status: 0,
      publishedAt: null,
      createdAt: new Date().toISOString(),
    };
    editions = [...editions, edition];
    return edition;
  }

  async listCurriculum(editionId: string, gradeOrYear?: number): Promise<CurriculumEntry[]> {
    return curriculum.filter(c =>
      c.programEditionId === editionId &&
      (gradeOrYear == null || c.gradeOrYear === gradeOrYear)
    );
  }

  async upsertCurriculumEntry(editionId: string, dto: UpsertCurriculumEntryDto): Promise<CurriculumEntry> {
    const existing = curriculum.find(
      c => c.programEditionId === editionId && c.subjectId === dto.subjectId && c.gradeOrYear === dto.gradeOrYear
    );
    if (existing) {
      const updated = { ...existing, ...dto };
      curriculum = curriculum.map(c => c.id === existing.id ? updated : c);
      return updated;
    }
    const entry: CurriculumEntry = { ...dto, id: crypto.randomUUID(), programEditionId: editionId };
    curriculum = [...curriculum, entry];
    return entry;
  }

  async bulkUpsertCurriculum(editionId: string, entries: UpsertCurriculumEntryDto[]): Promise<CurriculumEntry[]> {
    return Promise.all(entries.map(e => this.upsertCurriculumEntry(editionId, e)));
  }

  async listEnrollments(editionId: string): Promise<Enrollment[]> {
    return enrollments.filter(e => e.programEditionId === editionId);
  }

  async enrollStudent(editionId: string, dto: EnrollStudentDto): Promise<Enrollment> {
    const enrollment: Enrollment = {
      ...dto,
      id: crypto.randomUUID(),
      programEditionId: editionId,
      status: 1,
      enrolledAt: new Date().toISOString(),
    };
    enrollments = [...enrollments, enrollment];
    return enrollment;
  }

  async bulkEnroll(editionId: string, students: EnrollStudentDto[]): Promise<Enrollment[]> {
    return Promise.all(students.map(s => this.enrollStudent(editionId, s)));
  }

  async updateEnrollmentStatus(editionId: string, enrollmentId: string, status: number): Promise<Enrollment> {
    const updated = enrollments.find(e => e.id === enrollmentId && e.programEditionId === editionId);
    if (!updated) throw new Error('Matrícula não encontrada');
    const result = { ...updated, status: status as Enrollment['status'] };
    enrollments = enrollments.map(e => e.id === enrollmentId ? result : e);
    return result;
  }

  async listPeriods(editionId: string): Promise<ProgramPeriod[]> {
    return periods.filter(p => p.programEditionId === editionId);
  }

  async generatePeriods(editionId: string): Promise<ProgramPeriod[]> {
    const edition = await this.get(editionId);
    const start = new Date(edition.startDate);
    const end = new Date(edition.endDate);
    const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    const numPeriods = 4;
    const daysPer = Math.floor(totalDays / numPeriods);
    const names = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];

    const generated: ProgramPeriod[] = Array.from({ length: numPeriods }, (_, i) => {
      const periodStart = new Date(start.getTime() + i * daysPer * 86400000);
      const periodEnd = i === numPeriods - 1 ? end : new Date(start.getTime() + (i + 1) * daysPer * 86400000 - 86400000);
      return {
        id: crypto.randomUUID(),
        programEditionId: editionId,
        number: i + 1,
        name: names[i],
        startDate: periodStart.toISOString().split('T')[0],
        endDate: periodEnd.toISOString().split('T')[0],
        schoolDays: Math.floor(daysPer * 0.7),
      };
    });

    periods = [...periods.filter(p => p.programEditionId !== editionId), ...generated];
    return generated;
  }

  async createPeriod(editionId: string, dto: CreatePeriodDto): Promise<ProgramPeriod> {
    const period: ProgramPeriod = { ...dto, id: crypto.randomUUID(), programEditionId: editionId };
    periods = [...periods, period];
    return period;
  }

  async generateCalendar(editionId: string): Promise<void> {
    // Mock: no-op, calendar is always "generated"
  }

  async getCalendarSummary(editionId: string): Promise<CalendarSummary> {
    return {
      totalSchoolDays: 182,
      totalHolidays: 11,
      totalRecesses: 2,
      workingDaysByMonth: {
        'Fev/2025': 18, 'Mar/2025': 21, 'Abr/2025': 18,
        'Mai/2025': 20, 'Jun/2025': 19, 'Jul/2025': 15,
        'Ago/2025': 21, 'Set/2025': 20, 'Out/2025': 20,
        'Nov/2025': 16, 'Dez/2025': 14,
      },
    };
  }

  async listClassGroups(editionId: string): Promise<ClassGroup[]> {
    return classGroups.filter(g => g.programEditionId === editionId);
  }

  async getClassGroup(editionId: string, groupId: string): Promise<ClassGroup> {
    const found = classGroups.find(g => g.id === groupId && g.programEditionId === editionId);
    if (!found) throw new Error('Turma não encontrada');
    return found;
  }

  async createClassGroup(editionId: string, dto: CreateClassGroupDto): Promise<ClassGroup> {
    const group: ClassGroup = { ...dto, id: crypto.randomUUID(), programEditionId: editionId, studentCount: 0 };
    classGroups = [...classGroups, group];
    return group;
  }

  async generateClassGroups(editionId: string, dto: GenerateClassGroupsDto): Promise<ClassGroup[]> {
    const generated: ClassGroup[] = dto.groups.flatMap(g =>
      Array.from({ length: g.numberOfGroups }, (_, i) => ({
        id: crypto.randomUUID(),
        programEditionId: editionId,
        name: `${g.gradeOrYear}º Ano ${String.fromCharCode(65 + i)}`,
        gradeOrYear: g.gradeOrYear,
        roomId: g.roomId ?? null,
        shiftId: g.shiftId ?? null,
        maxStudents: g.maxStudents,
        studentCount: 0,
      }))
    );
    classGroups = [...classGroups.filter(g => g.programEditionId !== editionId), ...generated];
    return generated;
  }

  async assignStudentsToGroups(editionId: string): Promise<void> {
    const editionEnrollments = enrollments.filter(e => e.programEditionId === editionId && e.status === 1);
    const groups = classGroups.filter(g => g.programEditionId === editionId);
    let idx = 0;
    classGroups = classGroups.map(g => {
      if (g.programEditionId !== editionId) return g;
      const gradeEnrollments = editionEnrollments.filter(e => e.gradeOrYear === g.gradeOrYear);
      const count = Math.min(gradeEnrollments.length - idx, g.maxStudents);
      idx += count;
      return { ...g, studentCount: count };
    });
  }

  async generateSchedule(editionId: string): Promise<void> {
    const groups = classGroups.filter(g => g.programEditionId === editionId);
    const days = [1, 2, 3, 4, 5];
    const generated: ScheduleSlotAssignment[] = groups.flatMap(g =>
      days.map(day => ({
        id: crypto.randomUUID(),
        classGroupId: g.id,
        subjectId: '33333333-0000-0000-0000-000000000001',
        teacherId: '44444444-0000-0000-0000-000000000001',
        dayOfWeek: day,
        scheduleSlotId: '55555555-1111-0000-0000-000000000001',
      }))
    );
    scheduleSlots = [...scheduleSlots.filter(s => !groups.find(g => g.id === s.classGroupId)), ...generated];
  }

  async getClassGroupSchedule(editionId: string, groupId: string): Promise<ScheduleSlotAssignment[]> {
    return scheduleSlots.filter(s => s.classGroupId === groupId);
  }

  async getTeacherSchedule(editionId: string, teacherId: string): Promise<ScheduleSlotAssignment[]> {
    return scheduleSlots.filter(s => s.teacherId === teacherId);
  }

  async runConflictDetection(editionId: string): Promise<ConflictReport> {
    conflictReport = { hasConflicts: false, conflicts: [] };
    return conflictReport;
  }

  async getConflictReport(editionId: string): Promise<ConflictReport> {
    return conflictReport ?? { hasConflicts: false, conflicts: [] };
  }

  async overrideScheduleSlot(editionId: string, scheduleId: string, dto: OverrideScheduleSlotDto): Promise<void> {
    scheduleSlots = scheduleSlots.map(s =>
      s.id === scheduleId ? { ...s, ...dto } : s
    );
  }

  async listProgress(editionId: string): Promise<ProgressRecord[]> {
    const editionEnrollments = new Set(
      enrollments.filter(e => e.programEditionId === editionId).map(e => e.id)
    );
    return progressRecords.filter(p => editionEnrollments.has(p.enrollmentId));
  }

  async recordProgress(dto: RecordProgressDto): Promise<ProgressRecord> {
    const record: ProgressRecord = { ...dto, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    progressRecords = [...progressRecords, record];
    return record;
  }

  async bulkRecordProgress(editionId: string, periodId: string, records: RecordProgressDto[]): Promise<ProgressRecord[]> {
    return Promise.all(records.map(r => this.recordProgress(r)));
  }

  async getPromotionPreview(editionId: string, targetEditionId: string): Promise<PromotionResult> {
    const editionEnrollments = enrollments.filter(e => e.programEditionId === editionId && e.status === 1);
    return {
      promoted: editionEnrollments.length,
      retained: 0,
      graduated: 0,
      details: editionEnrollments.map(e => ({
        enrollmentId: e.id,
        studentId: e.studentId,
        result: 'Promovido',
      })),
    };
  }

  async runPromotion(editionId: string, dto: RunPromotionDto): Promise<PromotionResult> {
    return this.getPromotionPreview(editionId, dto.targetEditionId);
  }

  async getPublishChecklist(editionId: string): Promise<PublishChecklist> {
    const editionPeriods = periods.filter(p => p.programEditionId === editionId);
    const editionGroups = classGroups.filter(g => g.programEditionId === editionId);
    const editionCurriculum = curriculum.filter(c => c.programEditionId === editionId);
    const editionEnrollments = enrollments.filter(e => e.programEditionId === editionId);

    const items = [
      { label: 'Períodos definidos', passed: editionPeriods.length > 0, description: `${editionPeriods.length} período(s) configurado(s)` },
      { label: 'Currículo configurado', passed: editionCurriculum.length > 0, description: `${editionCurriculum.length} entrada(s) no currículo` },
      { label: 'Alunos matriculados', passed: editionEnrollments.length > 0, description: `${editionEnrollments.length} matrícula(s)` },
      { label: 'Turmas criadas', passed: editionGroups.length > 0, description: `${editionGroups.length} turma(s)` },
      { label: 'Grade horária gerada', passed: scheduleSlots.some(s => editionGroups.find(g => g.id === s.classGroupId)), description: 'Grade horária configurada' },
    ];

    return { items, canPublish: items.every(i => i.passed) };
  }

  async publish(editionId: string): Promise<ProgramEdition> {
    editions = editions.map(e =>
      e.id === editionId ? { ...e, status: 2 as EditionStatus, publishedAt: new Date().toISOString() } : e
    );
    return this.get(editionId);
  }

  async close(editionId: string): Promise<ProgramEdition> {
    editions = editions.map(e =>
      e.id === editionId ? { ...e, status: 3 as EditionStatus } : e
    );
    return this.get(editionId);
  }
}
