'use client';

import { useState } from 'react';
import { ProgressRecord, ProgramPeriod, Enrollment, PROGRESS_STATUS_LABELS, ProgressStatus, RecordProgressDto } from '../../models/programEditionModel';
import { TrendingUp, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  progress: ProgressRecord[];
  periods: ProgramPeriod[];
  enrollments: Enrollment[];
  loading: boolean;
  actionLoading: boolean;
  onRecord: (dto: RecordProgressDto) => Promise<unknown>;
}

const STATUS_COLORS: Record<number, string> = {
  1: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  2: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  3: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  4: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  5: 'bg-muted text-muted-foreground',
  6: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  7: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  8: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  9: 'bg-gray-100 text-gray-600',
};

export function ProgressTab({ progress, periods, enrollments, loading, actionLoading, onRecord }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<RecordProgressDto>({
    enrollmentId: enrollments[0]?.id ?? '',
    programPeriodId: periods[0]?.id ?? '',
    status: 4,
    finalGrade: null,
    completionPercent: null,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onRecord(form);
    setShowForm(false);
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>{progress.length} registro(s) de progresso</p>
        <button onClick={() => setShowForm(v => !v)}
          className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors'>
          <Plus size={14} /> Registrar Progresso
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className='bg-muted rounded-xl p-4 space-y-3'>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-xs font-medium'>Matrícula *</label>
              <select required className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.enrollmentId} onChange={e => setForm(f => ({ ...f, enrollmentId: e.target.value }))}>
                {enrollments.map(e => <option key={e.id} value={e.id}>{e.studentId.slice(0, 8)}... ({e.gradeOrYear}º)</option>)}
              </select>
            </div>
            <div>
              <label className='text-xs font-medium'>Período *</label>
              <select required className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.programPeriodId} onChange={e => setForm(f => ({ ...f, programPeriodId: e.target.value }))}>
                {periods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div className='grid grid-cols-3 gap-3'>
            <div>
              <label className='text-xs font-medium'>Status *</label>
              <select required className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.status} onChange={e => setForm(f => ({ ...f, status: Number(e.target.value) as ProgressStatus }))}>
                {([1, 2, 3, 4, 5, 6, 7, 8, 9] as ProgressStatus[]).map(s => (
                  <option key={s} value={s}>{PROGRESS_STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className='text-xs font-medium'>Nota Final</label>
              <input type='number' min={0} max={10} step={0.1} className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.finalGrade ?? ''} onChange={e => setForm(f => ({ ...f, finalGrade: e.target.value ? Number(e.target.value) : null }))}
                placeholder='0.0–10.0' />
            </div>
            <div>
              <label className='text-xs font-medium'>Conclusão %</label>
              <input type='number' min={0} max={100} className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.completionPercent ?? ''} onChange={e => setForm(f => ({ ...f, completionPercent: e.target.value ? Number(e.target.value) : null }))} />
            </div>
          </div>
          <div className='flex gap-2 justify-end'>
            <button type='button' onClick={() => setShowForm(false)} className='px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-card transition-colors'>Cancelar</button>
            <button type='submit' disabled={actionLoading} className='px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50'>Registrar</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className='space-y-2'>{[1, 2, 3].map(i => <Skeleton key={i} className='h-14 rounded-xl' />)}</div>
      ) : progress.length === 0 ? (
        <div className='text-center py-12 text-muted-foreground'>
          <TrendingUp size={32} className='mx-auto mb-2 opacity-40' />
          <p className='text-sm'>Nenhum progresso registrado.</p>
        </div>
      ) : (
        <div className='space-y-2'>
          {progress.map(p => (
            <div key={p.id} className='bg-card border border-border rounded-xl p-3 flex items-center justify-between'>
              <div>
                <p className='text-xs text-muted-foreground font-mono'>{p.enrollmentId.slice(0, 8)}...</p>
                <p className='text-xs text-muted-foreground'>Período: {p.programPeriodId.slice(0, 8)}...</p>
              </div>
              <div className='flex items-center gap-2'>
                {p.finalGrade != null && <span className='text-sm font-bold'>{p.finalGrade}</span>}
                {p.completionPercent != null && <span className='text-xs text-muted-foreground'>{p.completionPercent}%</span>}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status]}`}>
                  {PROGRESS_STATUS_LABELS[p.status as ProgressStatus]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
