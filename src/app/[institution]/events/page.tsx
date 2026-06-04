'use client';

import { useState } from 'react';
import { useInstitutionStore } from '@/entities/institution';
import { useEvents } from '@/features/events/hooks/useEvents';
import { EventFormModal } from '@/features/events/components/EventFormModal';
import type { CalendarEvent } from '@/features/events/models/eventModel';
import { EVENT_TYPE_CONFIG } from '@/features/events/models/eventModel';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil, Trash2, Clock, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'upcoming' | 'past';

const today = new Date().toISOString().split('T')[0];

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export default function EventsPage() {
  const { institution } = useInstitutionStore();
  const alias = institution?.alias ?? '';
  const { events, loading, saveEvent, deleteEvent } = useEvents(alias);

  const [filter, setFilter] = useState<Filter>('upcoming');
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | undefined>();

  const sorted = [...events].sort((a, b) => a.startDate.localeCompare(b.startDate));

  const filtered = sorted.filter(e => {
    if (filter === 'upcoming') return e.startDate >= today;
    if (filter === 'past') return e.startDate < today;
    return true;
  });

  const upcomingCount = sorted.filter(e => e.startDate >= today).length;
  const pastCount = sorted.filter(e => e.startDate < today).length;

  return (
    <div className='p-6 max-w-3xl mx-auto space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Eventos</h1>
          <p className='text-sm text-muted-foreground mt-1'>Gerencie os eventos e atividades da instituição.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors'
        >
          <CalendarDays size={15} /> Novo Evento
        </button>
      </div>

      {/* Filter tabs */}
      <div className='flex gap-1 p-1 bg-muted rounded-lg w-fit'>
        {([
          ['all', `Todos (${sorted.length})`],
          ['upcoming', `Próximos (${upcomingCount})`],
          ['past', `Passados (${pastCount})`],
        ] as [Filter, string][]).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              filter === value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className='space-y-3'>
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className='h-24 w-full rounded-xl' />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className='py-16 text-center rounded-xl border border-dashed border-border text-muted-foreground text-sm'>
          {filter === 'upcoming' ? 'Nenhum evento futuro cadastrado.' : 'Nenhum evento encontrado.'}
        </div>
      ) : (
        <div className='space-y-3'>
          {filtered.map(event => {
            const cfg = EVENT_TYPE_CONFIG[event.type];
            const isPast = event.startDate < today;
            const isMultiDay = event.endDate !== event.startDate;

            return (
              <div
                key={event.id}
                className={cn(
                  'group flex gap-0 rounded-xl border overflow-hidden transition-colors hover:bg-muted/30',
                  isPast && 'opacity-60',
                )}
              >
                {/* Color bar */}
                <div className='w-1 shrink-0' style={{ backgroundColor: cfg.color }} />

                <div className='flex-1 flex items-start gap-4 px-4 py-4 min-w-0'>
                  {/* Date block */}
                  <div className='shrink-0 text-center w-12'>
                    <p className='text-xs font-bold text-muted-foreground uppercase leading-none'>
                      {new Date(event.startDate + 'T12:00:00').toLocaleString('pt-BR', { month: 'short' })}
                    </p>
                    <p className='text-2xl font-bold text-foreground leading-tight'>
                      {event.startDate.split('-')[2]}
                    </p>
                    <p className='text-xs text-muted-foreground leading-none'>
                      {new Date(event.startDate + 'T12:00:00').toLocaleString('pt-BR', { weekday: 'short' })}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className='w-px self-stretch bg-border shrink-0' />

                  {/* Content */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1 flex-wrap'>
                      <span
                        className='text-xs px-2 py-0.5 rounded-full font-medium'
                        style={{ backgroundColor: `${cfg.color}20`, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                      {event.allDay && (
                        <span className='text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground'>
                          Dia inteiro
                        </span>
                      )}
                      {isMultiDay && (
                        <span className='text-xs text-muted-foreground'>
                          até {formatDate(event.endDate)}
                        </span>
                      )}
                    </div>

                    <p className='text-sm font-semibold text-foreground'>{event.title}</p>

                    {!event.allDay && event.startTime && (
                      <p className='flex items-center gap-1 text-xs text-muted-foreground mt-0.5'>
                        <Clock size={11} />
                        {event.startTime}{event.endTime ? `–${event.endTime}` : ''}
                      </p>
                    )}

                    {event.description && (
                      <p className='text-xs text-muted-foreground mt-1.5 line-clamp-2'>
                        {event.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0'>
                    <button
                      onClick={() => setEditing(event)}
                      className='p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-colors'
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className='p-1.5 rounded text-muted-foreground hover:text-danger hover:bg-muted transition-colors'
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <EventFormModal onSave={saveEvent} onClose={() => setShowCreate(false)} />
      )}
      {editing && (
        <EventFormModal event={editing} onSave={saveEvent} onClose={() => setEditing(undefined)} />
      )}
    </div>
  );
}
