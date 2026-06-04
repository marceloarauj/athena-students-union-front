'use client';

import { useState } from 'react';
import { Enrollment, ENROLLMENT_STATUS_LABELS, EnrollmentStatus, EnrollStudentDto } from '../../models/programEditionModel';
import { UserPlus, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  enrollments: Enrollment[];
  loading: boolean;
  actionLoading: boolean;
  onEnroll: (dto: EnrollStudentDto) => Promise<unknown>;
  onUpdateStatus: (enrollmentId: string, status: number) => Promise<unknown>;
}

const STATUS_COLORS: Record<number, string> = {
  1: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  2: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  3: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  4: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export function EnrollmentTab({ enrollments, loading, actionLoading, onEnroll, onUpdateStatus }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<EnrollStudentDto>({ studentId: '', gradeOrYear: null });

  async function handleEnroll(e: React.FormEvent) {
    e.preventDefault();
    await onEnroll(form);
    setShowForm(false);
    setForm({ studentId: '', gradeOrYear: null });
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>{enrollments.length} matrícula(s)</p>
        <button
          onClick={() => setShowForm(v => !v)}
          className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors'
        >
          <UserPlus size={14} /> Matricular Aluno
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleEnroll} className='bg-muted rounded-xl p-4 space-y-3'>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-xs font-medium'>ID do Aluno *</label>
              <input required className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}
                placeholder='UUID do aluno' />
            </div>
            <div>
              <label className='text-xs font-medium'>Série/Ano</label>
              <input type='number' min={1} className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.gradeOrYear ?? ''} onChange={e => setForm(f => ({ ...f, gradeOrYear: e.target.value ? Number(e.target.value) : null }))}
                placeholder='Opcional' />
            </div>
          </div>
          <div className='flex gap-2 justify-end'>
            <button type='button' onClick={() => setShowForm(false)} className='px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-card transition-colors'>Cancelar</button>
            <button type='submit' disabled={actionLoading} className='px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50'>
              Matricular
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className='space-y-2'>{[1, 2, 3].map(i => <Skeleton key={i} className='h-14 rounded-xl' />)}</div>
      ) : enrollments.length === 0 ? (
        <div className='text-center py-12 text-muted-foreground'>
          <Users size={32} className='mx-auto mb-2 opacity-40' />
          <p className='text-sm'>Nenhum aluno matriculado.</p>
        </div>
      ) : (
        <div className='space-y-2'>
          {enrollments.map(e => (
            <div key={e.id} className='bg-card border border-border rounded-xl p-3 flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium font-mono truncate max-w-[200px]'>{e.studentId}</p>
                <p className='text-xs text-muted-foreground'>
                  {e.gradeOrYear != null ? `${e.gradeOrYear}º Ano · ` : ''}
                  {new Date(e.enrolledAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[e.status]}`}>
                  {ENROLLMENT_STATUS_LABELS[e.status as EnrollmentStatus]}
                </span>
                <select
                  className='text-xs border border-border rounded-md bg-input px-1 py-0.5'
                  value={e.status}
                  onChange={ev => onUpdateStatus(e.id, Number(ev.target.value))}
                >
                  {[1, 2, 3, 4].map(s => (
                    <option key={s} value={s}>{ENROLLMENT_STATUS_LABELS[s as EnrollmentStatus]}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
