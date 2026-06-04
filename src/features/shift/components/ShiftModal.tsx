'use client';

import { useState } from 'react';
import { CreateShiftDto } from '../models/shiftModel';

interface Props {
  onSave: (dto: CreateShiftDto) => Promise<unknown>;
  onClose: () => void;
}

export function ShiftModal({ onSave, onClose }: Props) {
  const [form, setForm] = useState<CreateShiftDto>({ name: '', startTime: '07:00', endTime: '12:00' });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); onClose(); } finally { setSaving(false); }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-card border border-border rounded-xl shadow-xl w-full max-w-sm p-6'>
        <h2 className='text-lg font-bold mb-4'>Novo Turno</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Nome *</label>
            <input required className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder='Ex: Manhã' />
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
              {saving ? 'Salvando...' : 'Criar Turno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
