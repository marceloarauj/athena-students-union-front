'use client';

import { useState } from 'react';
import { ProgramPeriod, CreatePeriodDto } from '../../models/programEditionModel';
import { Wand2, Plus, CalendarDays } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  periods: ProgramPeriod[];
  loading: boolean;
  actionLoading: boolean;
  onGenerate: () => Promise<unknown>;
  onCreatePeriod: (dto: CreatePeriodDto) => Promise<unknown>;
}

export function PeriodsTab({ periods, loading, actionLoading, onGenerate, onCreatePeriod }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreatePeriodDto>({ number: periods.length + 1, name: '', startDate: '', endDate: '' });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await onCreatePeriod(form);
    setShowForm(false);
    setForm({ number: periods.length + 2, name: '', startDate: '', endDate: '' });
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>{periods.length} período(s) configurado(s)</p>
        <div className='flex gap-2'>
          <button
            onClick={() => setShowForm(v => !v)}
            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors'
          >
            <Plus size={14} /> Manual
          </button>
          <button
            onClick={onGenerate}
            disabled={actionLoading}
            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50'
          >
            <Wand2 size={14} /> {actionLoading ? 'Gerando...' : 'Gerar Períodos'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className='bg-muted rounded-xl p-4 space-y-3'>
          <div className='grid grid-cols-3 gap-3'>
            <div>
              <label className='text-xs font-medium'>Número</label>
              <input type='number' min={1} className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.number} onChange={e => setForm(f => ({ ...f, number: Number(e.target.value) }))} />
            </div>
            <div className='col-span-2'>
              <label className='text-xs font-medium'>Nome *</label>
              <input required className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder='Ex: 1º Semestre' />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-xs font-medium'>Início *</label>
              <input required type='date' className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div>
              <label className='text-xs font-medium'>Término *</label>
              <input required type='date' className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <div className='flex gap-2 justify-end'>
            <button type='button' onClick={() => setShowForm(false)} className='px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-card transition-colors'>Cancelar</button>
            <button type='submit' className='px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors'>Adicionar</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className='space-y-2'>{[1, 2, 3, 4].map(i => <Skeleton key={i} className='h-16 rounded-xl' />)}</div>
      ) : periods.length === 0 ? (
        <div className='text-center py-12 text-muted-foreground'>
          <CalendarDays size={32} className='mx-auto mb-2 opacity-40' />
          <p className='text-sm'>Nenhum período configurado. Use "Gerar Períodos" para criar automaticamente.</p>
        </div>
      ) : (
        <div className='space-y-2'>
          {periods.map(p => (
            <div key={p.id} className='bg-card border border-border rounded-xl p-4 flex items-center justify-between'>
              <div>
                <p className='font-semibold text-sm'>{p.name}</p>
                <p className='text-xs text-muted-foreground'>{p.startDate} → {p.endDate}</p>
              </div>
              {p.schoolDays != null && (
                <span className='text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium'>{p.schoolDays} dias letivos</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
