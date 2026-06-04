'use client';

import { useState } from 'react';
import { CreateAcademicProgramDto, PERIOD_TYPE_LABELS, PROGRAM_TYPE_LABELS, PeriodType, ProgramType } from '../models/academicProgramModel';

interface Props {
  onSave: (dto: CreateAcademicProgramDto) => Promise<unknown>;
  onClose: () => void;
}

export function AcademicProgramModal({ onSave, onClose }: Props) {
  const [form, setForm] = useState<CreateAcademicProgramDto>({
    name: '',
    type: 1,
    periodType: 1,
    hasWeeklySchedule: true,
    durationYears: 1,
    minCompletionPercent: 75,
    minSchoolDays: null,
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-card border border-border rounded-xl shadow-xl w-full max-w-lg p-6'>
        <h2 className='text-lg font-bold mb-4'>Novo Programa Acadêmico</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='text-sm font-medium text-foreground'>Nome *</label>
            <input
              required
              className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-sm font-medium text-foreground'>Tipo *</label>
              <select
                className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: Number(e.target.value) as ProgramType }))}
              >
                {([1, 2, 3] as ProgramType[]).map(t => (
                  <option key={t} value={t}>{PROGRAM_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className='text-sm font-medium text-foreground'>Período *</label>
              <select
                className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.periodType}
                onChange={e => setForm(f => ({ ...f, periodType: Number(e.target.value) as PeriodType }))}
              >
                {([0, 1, 2, 3, 4] as PeriodType[]).map(t => (
                  <option key={t} value={t}>{PERIOD_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-sm font-medium text-foreground'>Duração (anos)</label>
              <input
                type='number' min={1} max={10}
                className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.durationYears}
                onChange={e => setForm(f => ({ ...f, durationYears: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className='text-sm font-medium text-foreground'>% Mín. de Frequência</label>
              <input
                type='number' min={0} max={100}
                className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.minCompletionPercent ?? ''}
                onChange={e => setForm(f => ({ ...f, minCompletionPercent: e.target.value ? Number(e.target.value) : null }))}
              />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-sm font-medium text-foreground'>Dias letivos mínimos</label>
              <input
                type='number' min={0}
                className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.minSchoolDays ?? ''}
                onChange={e => setForm(f => ({ ...f, minSchoolDays: e.target.value ? Number(e.target.value) : null }))}
                placeholder='Opcional'
              />
            </div>
            <div className='flex items-end pb-2'>
              <label className='flex items-center gap-2 text-sm cursor-pointer'>
                <input
                  type='checkbox'
                  checked={form.hasWeeklySchedule}
                  onChange={e => setForm(f => ({ ...f, hasWeeklySchedule: e.target.checked }))}
                  className='w-4 h-4 accent-primary'
                />
                Grade horária semanal
              </label>
            </div>
          </div>
          <div className='flex gap-3 justify-end pt-2'>
            <button type='button' onClick={onClose} className='px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors'>
              Cancelar
            </button>
            <button type='submit' disabled={saving} className='px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50'>
              {saving ? 'Salvando...' : 'Criar Programa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
