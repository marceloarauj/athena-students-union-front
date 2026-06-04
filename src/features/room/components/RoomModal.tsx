'use client';

import { useState } from 'react';
import { CreateRoomDto } from '../models/roomModel';

interface Props {
  onSave: (dto: CreateRoomDto) => Promise<unknown>;
  onClose: () => void;
}

export function RoomModal({ onSave, onClose }: Props) {
  const [form, setForm] = useState<CreateRoomDto>({ name: '', capacity: 30, hasLab: false });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); onClose(); } finally { setSaving(false); }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-card border border-border rounded-xl shadow-xl w-full max-w-sm p-6'>
        <h2 className='text-lg font-bold mb-4'>Nova Sala</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Nome *</label>
            <input required className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className='text-sm font-medium'>Capacidade *</label>
            <input required type='number' min={1} className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
              value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: Number(e.target.value) }))} />
          </div>
          <label className='flex items-center gap-2 text-sm cursor-pointer'>
            <input type='checkbox' checked={form.hasLab} onChange={e => setForm(f => ({ ...f, hasLab: e.target.checked }))} className='w-4 h-4 accent-primary' />
            É laboratório
          </label>
          <div className='flex gap-3 justify-end pt-2'>
            <button type='button' onClick={onClose} className='px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors'>Cancelar</button>
            <button type='submit' disabled={saving} className='px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50'>
              {saving ? 'Salvando...' : 'Criar Sala'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
