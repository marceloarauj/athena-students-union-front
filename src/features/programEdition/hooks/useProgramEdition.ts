'use client';

import { useEffect, useState } from 'react';
import {
  ProgramEdition, CurriculumEntry, Enrollment, ProgramPeriod,
  ClassGroup, ProgressRecord, ConflictReport, PublishChecklist, CalendarSummary,
  CreateProgramEditionDto, UpsertCurriculumEntryDto, EnrollStudentDto,
  CreatePeriodDto, CreateClassGroupDto, GenerateClassGroupsDto, RecordProgressDto, RunPromotionDto,
} from '../models/programEditionModel';
import { getProgramEditionService } from '../services/programEditionInterface';
import { toast } from 'sonner';

export function useProgramEditionList(institution: string, programId: string) {
  const [editions, setEditions] = useState<ProgramEdition[]>([]);
  const [loading, setLoading] = useState(true);
  const service = getProgramEditionService(institution);

  useEffect(() => {
    if (!programId) return;
    setLoading(true);
    service.listByProgram(programId).then(data => {
      setEditions(data);
      setLoading(false);
    });
  }, [institution, programId]);

  async function createEdition(dto: CreateProgramEditionDto) {
    const created = await service.create(dto);
    setEditions(prev => [...prev, created]);
    toast.success('Edição criada.');
    return created;
  }

  return { editions, loading, createEdition };
}

export function useProgramEditionDetail(institution: string, editionId: string) {
  const [edition, setEdition] = useState<ProgramEdition | null>(null);
  const [curriculum, setCurriculum] = useState<CurriculumEntry[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [periods, setPeriods] = useState<ProgramPeriod[]>([]);
  const [classGroups, setClassGroups] = useState<ClassGroup[]>([]);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [calendarSummary, setCalendarSummary] = useState<CalendarSummary | null>(null);
  const [conflictReport, setConflictReport] = useState<ConflictReport | null>(null);
  const [checklist, setChecklist] = useState<PublishChecklist | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const service = getProgramEditionService(institution);

  useEffect(() => {
    if (!editionId) return;
    setLoading(true);
    Promise.all([
      service.get(editionId),
      service.listCurriculum(editionId),
      service.listEnrollments(editionId),
      service.listPeriods(editionId),
      service.listClassGroups(editionId),
      service.listProgress(editionId),
    ]).then(([ed, curr, enr, per, grp, prg]) => {
      setEdition(ed);
      setCurriculum(curr);
      setEnrollments(enr);
      setPeriods(per);
      setClassGroups(grp);
      setProgress(prg);
      setLoading(false);
    });
  }, [institution, editionId]);

  async function run<T>(fn: () => Promise<T>, successMsg: string): Promise<T> {
    setActionLoading(true);
    try {
      const result = await fn();
      toast.success(successMsg);
      return result;
    } finally {
      setActionLoading(false);
    }
  }

  async function generatePeriods() {
    const result = await run(() => service.generatePeriods(editionId), 'Períodos gerados!');
    setPeriods(result);
    return result;
  }

  async function createPeriod(dto: CreatePeriodDto) {
    const result = await run(() => service.createPeriod(editionId, dto), 'Período criado.');
    setPeriods(prev => [...prev, result]);
    return result;
  }

  async function generateCalendar() {
    await run(() => service.generateCalendar(editionId), 'Calendário gerado!');
    const summary = await service.getCalendarSummary(editionId);
    setCalendarSummary(summary);
  }

  async function loadCalendarSummary() {
    const summary = await service.getCalendarSummary(editionId);
    setCalendarSummary(summary);
  }

  async function upsertCurriculumEntry(dto: UpsertCurriculumEntryDto) {
    const result = await run(() => service.upsertCurriculumEntry(editionId, dto), 'Currículo atualizado.');
    setCurriculum(prev => {
      const idx = prev.findIndex(c => c.id === result.id);
      return idx >= 0 ? prev.map(c => c.id === result.id ? result : c) : [...prev, result];
    });
    return result;
  }

  async function enrollStudent(dto: EnrollStudentDto) {
    const result = await run(() => service.enrollStudent(editionId, dto), 'Aluno matriculado.');
    setEnrollments(prev => [...prev, result]);
    return result;
  }

  async function updateEnrollmentStatus(enrollmentId: string, status: number) {
    const result = await run(() => service.updateEnrollmentStatus(editionId, enrollmentId, status), 'Status atualizado.');
    setEnrollments(prev => prev.map(e => e.id === enrollmentId ? result : e));
  }

  async function createClassGroup(dto: CreateClassGroupDto) {
    const result = await run(() => service.createClassGroup(editionId, dto), 'Turma criada.');
    setClassGroups(prev => [...prev, result]);
    return result;
  }

  async function generateClassGroups(dto: GenerateClassGroupsDto) {
    const result = await run(() => service.generateClassGroups(editionId, dto), 'Turmas geradas!');
    setClassGroups(result);
    return result;
  }

  async function assignStudentsToGroups() {
    await run(() => service.assignStudentsToGroups(editionId), 'Alunos distribuídos!');
    const groups = await service.listClassGroups(editionId);
    setClassGroups(groups);
  }

  async function generateSchedule() {
    await run(() => service.generateSchedule(editionId), 'Grade horária gerada!');
  }

  async function runConflictDetection() {
    const result = await run(() => service.runConflictDetection(editionId), 'Análise de conflitos concluída.');
    setConflictReport(result);
    return result;
  }

  async function recordProgress(dto: RecordProgressDto) {
    const result = await run(() => service.recordProgress(dto), 'Progresso registrado.');
    setProgress(prev => [...prev, result]);
    return result;
  }

  async function loadPublishChecklist() {
    const result = await service.getPublishChecklist(editionId);
    setChecklist(result);
    return result;
  }

  async function publish() {
    const result = await run(() => service.publish(editionId), 'Edição publicada!');
    setEdition(result);
    setChecklist(null);
    return result;
  }

  async function close() {
    const result = await run(() => service.close(editionId), 'Edição encerrada.');
    setEdition(result);
    return result;
  }

  async function runPromotion(dto: RunPromotionDto) {
    return run(() => service.runPromotion(editionId, dto), 'Promoção executada!');
  }

  return {
    edition, curriculum, enrollments, periods, classGroups, progress,
    calendarSummary, conflictReport, checklist,
    loading, actionLoading,
    generatePeriods, createPeriod,
    generateCalendar, loadCalendarSummary,
    upsertCurriculumEntry,
    enrollStudent, updateEnrollmentStatus,
    createClassGroup, generateClassGroups, assignStudentsToGroups,
    generateSchedule,
    runConflictDetection,
    recordProgress,
    loadPublishChecklist, publish, close,
    runPromotion,
    service,
  };
}
