'use client';

import { useState } from 'react';
import { CreateHolidayDto, HOLIDAY_TYPE_LABELS, HolidayType } from '../models/holidayModel';

interface Props {
  onSave: (dto: CreateHolidayDto) => Promise<unknown>;
  onClose: () => void;
}

export function HolidayModal({ onSave, onClose }: Props) {
  const [form, setForm] = useState<CreateHolidayDto>({ name: '', date: '', type: 1, isRecurring: false });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); onClose(); } finally { setSaving(false); }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-card border border-border rounded-xl shadow-xl w-full max-w-sm p-6'>
        <h2 className='text-lg font-bold mb-4'>Novo Feriado</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Nome *</label>
            <input required className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-sm font-medium'>Data *</label>
              <input required type='date' className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className='text-sm font-medium'>Tipo *</label>
              <select className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.type} onChange={e => setForm(f => ({ ...f, type: Number(e.target.value) as HolidayType }))}>
                {([1, 2, 3] as HolidayType[]).map(t => (
                  <option key={t} value={t}>{HOLIDAY_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
          </div>
          <label className='flex items-center gap-2 text-sm cursor-pointer'>
            <input type='checkbox' checked={form.isRecurring} onChange={e => setForm(f => ({ ...f, isRecurring: e.target.checked }))} className='w-4 h-4 accent-primary' />
            Recorrente anualmente
          </label>
          <div className='flex gap-3 justify-end pt-2'>
            <button type='button' onClick={onClose} className='px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors'>Cancelar</button>
            <button type='submit' disabled={saving} className='px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50'>
              {saving ? 'Salvando...' : 'Criar Feriado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
