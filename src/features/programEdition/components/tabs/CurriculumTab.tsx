'use client';

import { useState } from 'react';
import { CurriculumEntry, UpsertCurriculumEntryDto } from '../../models/programEditionModel';
import { Subject } from '@/features/subject/models/subjectModel';
import { BookOpen, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  curriculum: CurriculumEntry[];
  subjects: Subject[];
  loading: boolean;
  actionLoading: boolean;
  onUpsert: (dto: UpsertCurriculumEntryDto) => Promise<unknown>;
}

export function CurriculumTab({ curriculum, subjects, loading, actionLoading, onUpsert }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<UpsertCurriculumEntryDto>({ subjectId: subjects[0]?.id ?? '', gradeOrYear: null, weeklyHours: 2, totalHours: null });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onUpsert(form);
    setShowForm(false);
  }

  const subjectMap = new Map(subjects.map(s => [s.id, s]));

  const grouped = curriculum.reduce<Record<string, CurriculumEntry[]>>((acc, c) => {
    const key = c.gradeOrYear != null ? `${c.gradeOrYear}º Ano` : 'Geral';
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>{curriculum.length} entrada(s) no currículo</p>
        <button onClick={() => setShowForm(v => !v)}
          className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors'>
          <Plus size={14} /> Adicionar Matéria
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className='bg-muted rounded-xl p-4 space-y-3'>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-xs font-medium'>Matéria *</label>
              <select required className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.subjectId} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}>
                <option value=''>Selecione...</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
              </select>
            </div>
            <div>
              <label className='text-xs font-medium'>Série/Ano</label>
              <input type='number' min={1} className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.gradeOrYear ?? ''} onChange={e => setForm(f => ({ ...f, gradeOrYear: e.target.value ? Number(e.target.value) : null }))}
                placeholder='Opcional' />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-xs font-medium'>Aulas/semana</label>
              <input type='number' min={1} className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.weeklyHours ?? ''} onChange={e => setForm(f => ({ ...f, weeklyHours: e.target.value ? Number(e.target.value) : null }))} />
            </div>
            <div>
              <label className='text-xs font-medium'>Total de horas</label>
              <input type='number' min={1} className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.totalHours ?? ''} onChange={e => setForm(f => ({ ...f, totalHours: e.target.value ? Number(e.target.value) : null }))}
                placeholder='Opcional' />
            </div>
          </div>
          <div className='flex gap-2 justify-end'>
            <button type='button' onClick={() => setShowForm(false)} className='px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-card transition-colors'>Cancelar</button>
            <button type='submit' disabled={actionLoading} className='px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50'>Salvar</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className='space-y-2'>{[1, 2, 3].map(i => <Skeleton key={i} className='h-16 rounded-xl' />)}</div>
      ) : curriculum.length === 0 ? (
        <div className='text-center py-12 text-muted-foreground'>
          <BookOpen size={32} className='mx-auto mb-2 opacity-40' />
          <p className='text-sm'>Nenhuma matéria no currículo.</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {Object.entries(grouped).map(([grade, entries]) => (
            <div key={grade}>
              <h3 className='text-sm font-semibold text-muted-foreground mb-2'>{grade}</h3>
              <div className='space-y-1.5'>
                {entries.map(c => {
                  const subj = subjectMap.get(c.subjectId);
                  return (
                    <div key={c.id} className='bg-card border border-border rounded-lg p-3 flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded'>{subj?.code ?? '—'}</span>
                        <span className='text-sm font-medium'>{subj?.name ?? c.subjectId}</span>
                      </div>
                      <div className='flex gap-3 text-xs text-muted-foreground'>
                        {c.weeklyHours != null && <span>{c.weeklyHours}x/sem</span>}
                        {c.totalHours != null && <span>{c.totalHours}h total</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
