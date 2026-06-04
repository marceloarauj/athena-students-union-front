'use client';

import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { EventClickArg, EventInput } from '@fullcalendar/core/index.js';
import { CalendarDays, Clock, X } from 'lucide-react';

interface CalendarProps {
  events: EventInput[];
}

interface PopoverState {
  title: string;
  start: Date | null;
  end: Date | null;
  allDay: boolean;
  color: string;
  typeLabel: string;
  x: number;
  y: number;
}

const TYPE_LABELS: Record<string, string> = {
  holiday:   'Feriado',
  event:     'Evento',
  classroom: 'Aula',
  optional:  'Opcional',
};

function fmt(d: Date | null) {
  if (!d) return '';
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function fmtDate(d: Date | null) {
  if (!d) return '';
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
}

export default function Calendar({ events }: CalendarProps) {
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!popover) return;
    function onMouseDown(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopover(null);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [popover]);

  function handleEventClick(arg: EventClickArg) {
    arg.jsEvent.stopPropagation();

    const el = (arg.jsEvent.target as HTMLElement).closest('.fc-event') as HTMLElement | null;
    const rect = el ? el.getBoundingClientRect() : (arg.jsEvent.target as HTMLElement).getBoundingClientRect();

    const popoverWidth = 256;
    let x = rect.left + rect.width / 2 - popoverWidth / 2;
    x = Math.max(8, Math.min(x, window.innerWidth - popoverWidth - 8));

    let y = rect.bottom + 8;
    if (y + 160 > window.innerHeight) y = rect.top - 168;

    setPopover({
      title:     arg.event.title,
      start:     arg.event.start,
      end:       arg.event.end,
      allDay:    arg.event.allDay,
      color:     arg.event.backgroundColor,
      typeLabel: TYPE_LABELS[arg.event.extendedProps.type as string] ?? 'Evento',
      x,
      y,
    });
  }

  return (
    <div className='w-full rounded-xl border border-border bg-card p-4 relative'>
      <FullCalendar
        locale={ptBrLocale}
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView='timeGridWeek'
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        height='auto'
        slotMinTime='07:00:00'
        slotMaxTime='22:00:00'
        slotDuration='00:30:00'
        slotLabelInterval='01:00:00'
        nowIndicator
        allDayText='Dia inteiro'
        events={events}
        eventDisplay='block'
        dayMaxEvents={3}
        slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        eventClick={handleEventClick}
      />

      {popover && (
        <div
          ref={popoverRef}
          style={{ position: 'fixed', left: popover.x, top: popover.y, zIndex: 9999 }}
          className='w-64 bg-card border border-border rounded-xl shadow-2xl overflow-hidden'
        >
          <div className='h-1.5 w-full' style={{ backgroundColor: popover.color }} />
          <div className='p-4 space-y-3'>
            <div className='flex items-start justify-between gap-2'>
              <p className='font-semibold text-sm text-foreground leading-snug'>{popover.title}</p>
              <button
                onClick={() => setPopover(null)}
                className='shrink-0 p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
              >
                <X size={14} />
              </button>
            </div>

            <div className='space-y-1.5'>
              <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                <CalendarDays size={12} className='shrink-0' />
                <span className='capitalize'>{fmtDate(popover.start)}</span>
              </div>
              <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                <Clock size={12} className='shrink-0' />
                {popover.allDay
                  ? <span>Dia inteiro</span>
                  : <span>{fmt(popover.start)}{popover.end ? ` — ${fmt(popover.end)}` : ''}</span>
                }
              </div>
            </div>

            <span
              className='inline-block text-xs font-medium px-2.5 py-0.5 rounded-full text-white'
              style={{ backgroundColor: popover.color }}
            >
              {popover.typeLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function CalendarEvent(
  event: CalendarEventType,
  title: string,
  date: string,
  startTime?: string,
  endTime?: string,
  id?: number,
): EventInput {
  let color: string;
  switch (event) {
    case CalendarEventType.Holiday:   color = '#8b5cf6'; break;
    case CalendarEventType.Event:     color = '#3b82f6'; break;
    case CalendarEventType.Optional:  color = '#10b981'; break;
    case CalendarEventType.Classroom: color = '#f97316'; break;
    default:                          color = '#3b82f6';
  }

  const base = {
    id:              id !== undefined ? String(id) : undefined,
    title,
    backgroundColor: color,
    borderColor:     color,
    extendedProps:   { type: event },
  };

  if (startTime) {
    return {
      ...base,
      start: `${date}T${startTime}:00`,
      end:   endTime ? `${date}T${endTime}:00` : `${date}T${startTime}:00`,
    };
  }

  return { ...base, date, allDay: true };
}

export enum CalendarEventType {
  Holiday   = 'holiday',
  Event     = 'event',
  Optional  = 'optional',
  Classroom = 'classroom',
}
