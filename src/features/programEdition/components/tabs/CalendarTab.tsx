'use client';

import { useEffect } from 'react';
import { CalendarSummary } from '../../models/programEditionModel';
import { Wand2, CalendarDays } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  editionId: string;
  summary: CalendarSummary | null;
  actionLoading: boolean;
  onGenerate: () => Promise<unknown>;
  onLoad: () => Promise<unknown>;
}

export function CalendarTab({ summary, actionLoading, onGenerate, onLoad }: Props) {
  useEffect(() => { onLoad(); }, []);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>Calendário letivo da edição</p>
        <button
          onClick={onGenerate}
          disabled={actionLoading}
          className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50'
        >
          <Wand2 size={14} /> {actionLoading ? 'Gerando...' : 'Gerar Calendário'}
        </button>
      </div>

      {!summary ? (
        <div className='space-y-2'>{[1, 2, 3].map(i => <Skeleton key={i} className='h-12 rounded-xl' />)}</div>
      ) : (
        <>
          <div className='grid grid-cols-3 gap-3'>
            <div className='bg-card border border-border rounded-xl p-4 text-center'>
              <p className='text-2xl font-bold text-primary'>{summary.totalSchoolDays}</p>
              <p className='text-xs text-muted-foreground mt-1'>Dias Letivos</p>
            </div>
            <div className='bg-card border border-border rounded-xl p-4 text-center'>
              <p className='text-2xl font-bold text-foreground'>{summary.totalHolidays}</p>
              <p className='text-xs text-muted-foreground mt-1'>Feriados</p>
            </div>
            <div className='bg-card border border-border rounded-xl p-4 text-center'>
              <p className='text-2xl font-bold text-foreground'>{summary.totalRecesses}</p>
              <p className='text-xs text-muted-foreground mt-1'>Recessos</p>
            </div>
          </div>

          <div className='bg-card border border-border rounded-xl p-4'>
            <h3 className='text-sm font-semibold mb-3 flex items-center gap-2'><CalendarDays size={14} /> Dias letivos por mês</h3>
            <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
              {Object.entries(summary.workingDaysByMonth).map(([month, days]) => (
                <div key={month} className='text-center bg-muted rounded-lg p-2'>
                  <p className='text-xs text-muted-foreground'>{month}</p>
                  <p className='text-lg font-bold'>{days}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
