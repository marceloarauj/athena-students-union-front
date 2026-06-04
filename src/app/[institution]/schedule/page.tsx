'use client';

import { useInstitutionStore } from '@/entities/institution';
import { useSchedule } from '@/features/schedule/hooks/useSchedule';
import { ScheduleEvent } from '@/features/schedule/models/scheduleModel';
import Calendar, { CalendarEvent as makeCalendarEvent, CalendarEventType } from '@/components/ui/calendar';
import { EventInput } from '@fullcalendar/core/index.js';
import { Skeleton } from '@/components/ui/skeleton';

export default function SchedulePage() {
  const { institution } = useInstitutionStore();
  const { events, loading } = useSchedule(institution?.alias ?? '');

  const calendarEvents: EventInput[] = events.map((e: ScheduleEvent) =>
    makeCalendarEvent(CalendarEventType[e.type as keyof typeof CalendarEventType], e.title, e.date, e.startTime, e.endTime, e.id)
  );

  if (loading) {
    return (
      <div className='p-6'>
        <Skeleton className='h-[500px] w-full rounded-xl' />
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold text-foreground'>Calendário Letivo</h1>
        <p className='text-sm text-muted-foreground mt-1'>Eventos, feriados e atividades da escola.</p>
      </div>
      <Calendar events={calendarEvents} />
    </div>
  );
}
