'use client';

import { useState, useEffect } from 'react';
import { ClassGroup, ScheduleSlotAssignment } from '../../models/programEditionModel';
import { IProgramEditionService } from '../../services/programEditionInterface';
import { Wand2, CalendarDays } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DAY_OF_WEEK_LABELS } from '@/features/teacher/models/teacherModel';

interface Props {
  editionId: string;
  classGroups: ClassGroup[];
  actionLoading: boolean;
  service: IProgramEditionService;
  onGenerateSchedule: () => Promise<unknown>;
}

export function ScheduleTab({ editionId, classGroups, actionLoading, service, onGenerateSchedule }: Props) {
  const [selectedGroup, setSelectedGroup] = useState<string>(classGroups[0]?.id ?? '');
  const [schedule, setSchedule] = useState<ScheduleSlotAssignment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedGroup) return;
    setLoading(true);
    service.getClassGroupSchedule(editionId, selectedGroup)
      .then(data => { setSchedule(data); setLoading(false); });
  }, [selectedGroup, editionId]);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between flex-wrap gap-2'>
        <select
          className='rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
          value={selectedGroup}
          onChange={e => setSelectedGroup(e.target.value)}
        >
          {classGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <button
          onClick={onGenerateSchedule}
          disabled={actionLoading}
          className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50'
        >
          <Wand2 size={14} /> {actionLoading ? 'Gerando...' : 'Gerar Grade Horária'}
        </button>
      </div>

      {loading ? (
        <div className='space-y-2'>{[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className='h-12 rounded-xl' />)}</div>
      ) : schedule.length === 0 ? (
        <div className='text-center py-12 text-muted-foreground'>
          <CalendarDays size={32} className='mx-auto mb-2 opacity-40' />
          <p className='text-sm'>Grade horária não gerada. Use "Gerar Grade Horária".</p>
        </div>
      ) : (
        <div className='space-y-2'>
          {schedule.map(slot => (
            <div key={slot.id} className='bg-card border border-border rounded-lg p-3 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <span className='text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded'>
                  {DAY_OF_WEEK_LABELS[slot.dayOfWeek]}
                </span>
                <span className='text-sm font-mono text-muted-foreground'>{slot.scheduleSlotId.slice(0, 8)}...</span>
              </div>
              <div className='text-xs text-muted-foreground'>
                Matéria: <span className='font-medium'>{slot.subjectId.slice(0, 8)}...</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
