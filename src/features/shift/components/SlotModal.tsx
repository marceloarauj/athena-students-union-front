'use client';

import { useState } from 'react';
import { AddScheduleSlotDto } from '../models/shiftModel';

interface Props {
  shiftId: string;
  nextOrder: number;
  onSave: (shiftId: string, dto: AddScheduleSlotDto) => Promise<unknown>;
  onClose: () => void;
}

export function SlotModal({ shiftId, nextOrder, onSave, onClose }: Props) {
  const [form, setForm] = useState<AddScheduleSlotDto>({ order: nextOrder, startTime: '', endTime: '' });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onSave(shiftId, form); onClose(); } finally { setSaving(false); }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-card border border-border rounded-xl shadow-xl w-full max-w-sm p-6'>
        <h2 className='text-lg font-bold mb-4'>Adicionar Horário</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Ordem</label>
            <input type='number' min={1} className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
              value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-sm font-medium'>Início *</label>
              <input required type='time' className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
            </div>
            <div>
              <label className='text-sm font-medium'>Término *</label>
              <input required type='time' className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
            </div>
          </div>
          <div className='flex gap-3 justify-end pt-2'>
            <button type='button' onClick={onClose} className='px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors'>Cancelar</button>
            <button type='submit' disabled={saving} className='px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50'>
              {saving ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
