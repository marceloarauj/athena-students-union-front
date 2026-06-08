'use client';

import { useInstitutionStore } from '@/entities/institution';
import { useParentalControl } from '@/features/parentalControl/hooks/useParentalControl';
import {
  Child,
  ChildObservation,
  ChildGradeReport,
  GradeStatus,
  ActivityType,
} from '@/features/parentalControl/models/parentalControlModel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import Calendar, { CalendarEvent as makeCalendarEvent, CalendarEventType } from '@/components/ui/calendar';
import { EventInput } from '@fullcalendar/core/index.js';
import { AlertTriangle, BookOpen, CalendarCheck, ClipboardList, User } from 'lucide-react';
import { usePermissionGuard } from '@/features/auth/hooks/usePermissionGuard';

const gradeStatusMap: Record<GradeStatus, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  approved: { label: 'Aprovado', variant: 'success' },
  warning: { label: 'Atenção', variant: 'warning' },
  danger: { label: 'Reprovado', variant: 'danger' },
};

const activityTypeMap: Record<ActivityType, { label: string; variant: 'warning' | 'danger' | 'info' | 'muted' }> = {
  homework: { label: 'Tarefa', variant: 'warning' },
  test: { label: 'Prova', variant: 'danger' },
  event: { label: 'Evento', variant: 'info' },
  notice: { label: 'Aviso', variant: 'muted' },
};

function GradeCell({ value }: { value: number }) {
  const color =
    value >= 7 ? 'text-emerald-600 dark:text-emerald-400' :
    value >= 5 ? 'text-amber-600 dark:text-amber-400' :
    'text-danger';
  return <span className={`font-semibold ${color}`}>{value.toFixed(1)}</span>;
}

function GradesSection({ child }: { child: Child }) {
  const avg = child.grades.reduce((s, g) => s + g.average, 0) / (child.grades.length || 1);
  const highest = Math.max(...child.grades.map(g => g.average));
  const lowest = Math.min(...child.grades.map(g => g.average));

  return (
    <div className='space-y-4 mt-4'>
      <div className='grid grid-cols-3 gap-4'>
        {[
          { label: 'Média Geral', value: avg.toFixed(1) },
          { label: 'Melhor Nota', value: highest.toFixed(1) },
          { label: 'Menor Nota', value: lowest.toFixed(1) },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className='p-4 text-center'>
              <p className='text-2xl font-bold text-primary'>{stat.value}</p>
              <p className='text-xs text-muted-foreground mt-1'>{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notas por Disciplina</CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Disciplina</TableHead>
                <TableHead className='text-center'>B1</TableHead>
                <TableHead className='text-center'>B2</TableHead>
                <TableHead className='text-center'>B3</TableHead>
                <TableHead className='text-center'>B4</TableHead>
                <TableHead className='text-center'>Média</TableHead>
                <TableHead className='text-center'>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {child.grades.map((g: ChildGradeReport) => {
                const { label, variant } = gradeStatusMap[g.status];
                return (
                  <TableRow key={g.subject}>
                    <TableCell className='font-medium'>{g.subject}</TableCell>
                    <TableCell className='text-center'><GradeCell value={g.b1} /></TableCell>
                    <TableCell className='text-center'><GradeCell value={g.b2} /></TableCell>
                    <TableCell className='text-center'><GradeCell value={g.b3} /></TableCell>
                    <TableCell className='text-center'><GradeCell value={g.b4} /></TableCell>
                    <TableCell className='text-center'><GradeCell value={g.average} /></TableCell>
                    <TableCell className='text-center'>
                      <Badge variant={variant}>{label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ActivitiesSection({ child }: { child: Child }) {
  return (
    <div className='space-y-3 mt-4'>
      {child.activities.map(activity => {
        const { label, variant } = activityTypeMap[activity.type];
        const formattedDate = new Date(activity.date + 'T12:00:00').toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });
        return (
          <Card key={activity.id}>
            <CardContent className='p-4 flex items-start gap-4'>
              <div className='flex-1 space-y-1'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <p className='font-semibold text-foreground text-sm'>{activity.title}</p>
                  <Badge variant={variant}>{label}</Badge>
                </div>
                <p className='text-sm text-muted-foreground'>{activity.description}</p>
                <p className='text-xs text-muted-foreground'>{formattedDate}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function CalendarSection({ child }: { child: Child }) {
  const calendarEvents: EventInput[] = child.scheduleEvents.map(e =>
    makeCalendarEvent(CalendarEventType[e.type as keyof typeof CalendarEventType], e.title, e.date, e.startTime, e.endTime, e.id)
  );
  return (
    <div className='mt-4'>
      <Calendar events={calendarEvents} />
    </div>
  );
}

function ObservationSection({ observations }: { observations: ChildObservation[] }) {
  return (
    <div className='mt-4 space-y-3'>
      {observations.map(obs => {
        const formattedDate = new Date(obs.date + 'T12:00:00').toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });
        return (
          <Card key={obs.id} className='border-l-4 border-l-amber-500'>
            <CardContent className='p-4 space-y-2'>
              <div className='flex items-center justify-between gap-2 flex-wrap'>
                <div className='flex items-center gap-2'>
                  <AlertTriangle size={14} className='text-amber-500 shrink-0' />
                  <span className='text-sm font-semibold text-foreground'>{obs.author}</span>
                </div>
                <span className='text-xs text-muted-foreground'>{formattedDate}</span>
              </div>
              <p className='text-sm text-foreground leading-relaxed'>{obs.text}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ChildPanel({ child }: { child: Child }) {
  const hasObservations = (child.observations?.length ?? 0) > 0;

  return (
    <div className='space-y-4'>
      <Card>
        <CardContent className='p-4 flex items-center gap-4'>
          <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
            <User size={20} className='text-primary' />
          </div>
          <div>
            <p className='font-semibold text-foreground'>{child.name}</p>
            <p className='text-sm text-muted-foreground'>{child.className} · {child.teacher}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue='grades'>
        <TabsList>
          <TabsTrigger value='grades' className='flex items-center gap-1.5'>
            <BookOpen size={14} />
            Notas
          </TabsTrigger>
          <TabsTrigger value='activities' className='flex items-center gap-1.5'>
            <ClipboardList size={14} />
            Atividades
          </TabsTrigger>
          <TabsTrigger value='calendar' className='flex items-center gap-1.5'>
            <CalendarCheck size={14} />
            Calendário
          </TabsTrigger>
          {hasObservations && (
            <TabsTrigger
              value='observation'
              className='relative flex items-center gap-1.5 text-amber-600 dark:text-amber-400 data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm'
            >
              <AlertTriangle size={14} />
              Observações
              <span className='ml-0.5 min-w-[18px] h-[18px] rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center data-[state=active]:bg-white data-[state=active]:text-amber-600 px-1'>
                {child.observations!.length}
              </span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value='grades'>
          <GradesSection child={child} />
        </TabsContent>

        <TabsContent value='activities'>
          <ActivitiesSection child={child} />
        </TabsContent>

        <TabsContent value='calendar'>
          <CalendarSection child={child} />
        </TabsContent>

        {hasObservations && (
          <TabsContent value='observation'>
            <ObservationSection observations={child.observations!} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

export default function ParentalControlPage() {
  const allowed = usePermissionGuard('SHOW_SCREEN_PARENTAL_CONTROL');
  const { institution } = useInstitutionStore();
  const { children, loading } = useParentalControl(institution?.alias ?? '');

  if (!allowed) return null;

  if (loading) {
    return (
      <div className='p-6 max-w-4xl mx-auto space-y-6'>
        <Skeleton className='h-8 w-56' />
        <Skeleton className='h-4 w-72' />
        <Skeleton className='h-10 w-80' />
        <Skeleton className='h-20 w-full rounded-xl' />
        <Skeleton className='h-64 w-full rounded-xl' />
      </div>
    );
  }

  return (
    <div className='p-6 max-w-4xl mx-auto space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-foreground'>Controle Parental</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          Acompanhe o desempenho e a agenda dos seus filhos.
        </p>
      </div>

      <Tabs defaultValue={String(children[0]?.id)}>
        <TabsList className='w-full justify-start'>
          {children.map(child => (
            <TabsTrigger key={child.id} value={String(child.id)} className='flex items-center gap-2'>
              <User size={14} />
              {child.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {children.map(child => (
          <TabsContent key={child.id} value={String(child.id)}>
            <ChildPanel child={child} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
