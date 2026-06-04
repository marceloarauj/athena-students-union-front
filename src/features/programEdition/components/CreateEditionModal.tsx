'use client';

import { useState } from 'react';
import { AcademicProgram } from '@/features/academicProgram/models/academicProgramModel';
import { CreateProgramEditionDto } from '../models/programEditionModel';

interface Props {
  programs: AcademicProgram[];
  onSave: (dto: CreateProgramEditionDto) => Promise<unknown>;
  onClose: () => void;
}

export function CreateEditionModal({ programs, onSave, onClose }: Props) {
  const [form, setForm] = useState<CreateProgramEditionDto>({
    academicProgramId: programs[0]?.id ?? '',
    name: '',
    startDate: '',
    endDate: '',
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); onClose(); } finally { setSaving(false); }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6'>
        <h2 className='text-lg font-bold mb-4'>Nova Edição de Programa</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='text-sm font-medium'>Programa Acadêmico *</label>
            <select required className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
              value={form.academicProgramId} onChange={e => setForm(f => ({ ...f, academicProgramId: e.target.value }))}>
              {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className='text-sm font-medium'>Nome da Edição *</label>
            <input required className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder='Ex: Ensino Médio 2025' />
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-sm font-medium'>Data de Início *</label>
              <input required type='date' className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div>
              <label className='text-sm font-medium'>Data de Término *</label>
              <input required type='date' className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <div className='flex gap-3 justify-end pt-2'>
            <button type='button' onClick={onClose} className='px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors'>Cancelar</button>
            <button type='submit' disabled={saving} className='px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50'>
              {saving ? 'Criando...' : 'Criar Edição'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
