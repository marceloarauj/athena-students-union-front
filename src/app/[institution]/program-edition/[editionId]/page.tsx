'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useInstitutionStore } from '@/entities/institution';
import { useAcademicProgram } from '@/features/academicProgram/hooks/useAcademicProgram';
import { useProgramEditionDetail } from '@/features/programEdition/hooks/useProgramEdition';
import { useRoom } from '@/features/room/hooks/useRoom';
import { useShift } from '@/features/shift/hooks/useShift';
import { useSubject } from '@/features/subject/hooks/useSubject';
import { EditionStatusBadge } from '@/features/programEdition/components/EditionStatusBadge';
import { OverviewTab } from '@/features/programEdition/components/tabs/OverviewTab';
import { CurriculumTab } from '@/features/programEdition/components/tabs/CurriculumTab';
import { EnrollmentTab } from '@/features/programEdition/components/tabs/EnrollmentTab';
import { PeriodsTab } from '@/features/programEdition/components/tabs/PeriodsTab';
import { CalendarTab } from '@/features/programEdition/components/tabs/CalendarTab';
import { ClassGroupsTab } from '@/features/programEdition/components/tabs/ClassGroupsTab';
import { ScheduleTab } from '@/features/programEdition/components/tabs/ScheduleTab';
import { ConflictTab } from '@/features/programEdition/components/tabs/ConflictTab';
import { ProgressTab } from '@/features/programEdition/components/tabs/ProgressTab';
import { PublishTab } from '@/features/programEdition/components/tabs/PublishTab';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Wand2 } from 'lucide-react';

interface Props {
  params: Promise<{ institution: string; editionId: string }>;
}

export default function ProgramEditionDetailPage({ params }: Props) {
  const { editionId } = use(params);
  const { institution } = useInstitutionStore();
  const alias = institution?.alias ?? '';
  const router = useRouter();

  const {
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
    service,
  } = useProgramEditionDetail(alias, editionId);

  const { programs } = useAcademicProgram(alias);
  const { rooms } = useRoom(alias);
  const { shifts } = useShift(alias);

  const program = programs.find(p => p.id === edition?.academicProgramId);
  const { subjects } = useSubject(alias, program?.id ?? '');

  if (loading) {
    return (
      <div className='p-6 max-w-5xl mx-auto space-y-4'>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-48 w-full rounded-xl' />
      </div>
    );
  }

  if (!edition) {
    return (
      <div className='p-6 text-center text-muted-foreground'>
        <p>Edição não encontrada.</p>
        <button onClick={() => router.back()} className='mt-2 text-primary hover:underline text-sm'>Voltar</button>
      </div>
    );
  }

  return (
    <div className='p-6 max-w-5xl mx-auto space-y-5'>
      <div className='flex items-start justify-between'>
        <div>
          <button onClick={() => router.back()} className='flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors'>
            <ArrowLeft size={14} /> Voltar
          </button>
          <div className='flex items-center gap-3'>
            <h1 className='text-2xl font-bold'>{edition.name}</h1>
            <EditionStatusBadge status={edition.status} />
          </div>
          <p className='text-sm text-muted-foreground mt-1'>
            {program?.name ?? '—'} · {edition.startDate} → {edition.endDate}
          </p>
        </div>
        {actionLoading && (
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Wand2 size={14} className='animate-spin' />
            Processando...
          </div>
        )}
      </div>

      <Tabs defaultValue='overview'>
        <TabsList className='flex-wrap h-auto gap-1'>
          <TabsTrigger value='overview'>Visão Geral</TabsTrigger>
          <TabsTrigger value='curriculum'>Currículo</TabsTrigger>
          <TabsTrigger value='enrollments'>Matrículas</TabsTrigger>
          <TabsTrigger value='periods'>Períodos</TabsTrigger>
          <TabsTrigger value='calendar'>Calendário</TabsTrigger>
          <TabsTrigger value='groups'>Turmas</TabsTrigger>
          <TabsTrigger value='schedule'>Grade Horária</TabsTrigger>
          <TabsTrigger value='conflicts'>Conflitos</TabsTrigger>
          <TabsTrigger value='progress'>Progresso</TabsTrigger>
          <TabsTrigger value='publish'>Publicar</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='mt-4'>
          <OverviewTab
            edition={edition}
            program={program}
            enrollmentCount={enrollments.length}
            periodCount={periods.length}
            groupCount={classGroups.length}
          />
        </TabsContent>

        <TabsContent value='curriculum' className='mt-4'>
          <CurriculumTab
            curriculum={curriculum}
            subjects={subjects}
            loading={loading}
            actionLoading={actionLoading}
            onUpsert={upsertCurriculumEntry}
          />
        </TabsContent>

        <TabsContent value='enrollments' className='mt-4'>
          <EnrollmentTab
            enrollments={enrollments}
            loading={loading}
            actionLoading={actionLoading}
            onEnroll={enrollStudent}
            onUpdateStatus={updateEnrollmentStatus}
          />
        </TabsContent>

        <TabsContent value='periods' className='mt-4'>
          <PeriodsTab
            periods={periods}
            loading={loading}
            actionLoading={actionLoading}
            onGenerate={generatePeriods}
            onCreatePeriod={createPeriod}
          />
        </TabsContent>

        <TabsContent value='calendar' className='mt-4'>
          <CalendarTab
            editionId={editionId}
            summary={calendarSummary}
            actionLoading={actionLoading}
            onGenerate={generateCalendar}
            onLoad={loadCalendarSummary}
          />
        </TabsContent>

        <TabsContent value='groups' className='mt-4'>
          <ClassGroupsTab
            classGroups={classGroups}
            rooms={rooms}
            shifts={shifts}
            loading={loading}
            actionLoading={actionLoading}
            onCreateGroup={createClassGroup}
            onGenerateGroups={generateClassGroups}
            onAssignStudents={assignStudentsToGroups}
          />
        </TabsContent>

        <TabsContent value='schedule' className='mt-4'>
          <ScheduleTab
            editionId={editionId}
            classGroups={classGroups}
            actionLoading={actionLoading}
            service={service}
            onGenerateSchedule={generateSchedule}
          />
        </TabsContent>

        <TabsContent value='conflicts' className='mt-4'>
          <ConflictTab
            conflictReport={conflictReport}
            actionLoading={actionLoading}
            onRunDetection={runConflictDetection}
          />
        </TabsContent>

        <TabsContent value='progress' className='mt-4'>
          <ProgressTab
            progress={progress}
            periods={periods}
            enrollments={enrollments}
            loading={loading}
            actionLoading={actionLoading}
            onRecord={recordProgress}
          />
        </TabsContent>

        <TabsContent value='publish' className='mt-4'>
          <PublishTab
            edition={edition}
            checklist={checklist}
            actionLoading={actionLoading}
            onLoadChecklist={loadPublishChecklist}
            onPublish={publish}
            onClose={close}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
