'use client';

import { useState } from 'react';
import { ClassGroup, CreateClassGroupDto, GenerateClassGroupsDto } from '../../models/programEditionModel';
import { Room } from '@/features/room/models/roomModel';
import { Shift } from '@/features/shift/models/shiftModel';
import { Wand2, Plus, Users, UserCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  classGroups: ClassGroup[];
  rooms: Room[];
  shifts: Shift[];
  loading: boolean;
  actionLoading: boolean;
  onCreateGroup: (dto: CreateClassGroupDto) => Promise<unknown>;
  onGenerateGroups: (dto: GenerateClassGroupsDto) => Promise<unknown>;
  onAssignStudents: () => Promise<unknown>;
}

export function ClassGroupsTab({ classGroups, rooms, shifts, loading, actionLoading, onCreateGroup, onGenerateGroups, onAssignStudents }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [showGenForm, setShowGenForm] = useState(false);
  const [form, setForm] = useState<CreateClassGroupDto>({ name: '', gradeOrYear: null, roomId: null, shiftId: null, maxStudents: 35 });
  const [genConfig, setGenConfig] = useState({ gradeOrYear: 1, numberOfGroups: 2, maxStudents: 35, roomId: '', shiftId: '' });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await onCreateGroup(form);
    setShowForm(false);
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    await onGenerateGroups({
      groups: [{ ...genConfig, roomId: genConfig.roomId || null, shiftId: genConfig.shiftId || null }],
    });
    setShowGenForm(false);
  }

  const roomMap = new Map(rooms.map(r => [r.id, r]));
  const shiftMap = new Map(shifts.map(s => [s.id, s]));

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between flex-wrap gap-2'>
        <p className='text-sm text-muted-foreground'>{classGroups.length} turma(s)</p>
        <div className='flex gap-2 flex-wrap'>
          <button onClick={onAssignStudents} disabled={actionLoading || classGroups.length === 0}
            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors disabled:opacity-50'>
            <UserCheck size={14} /> Distribuir Alunos
          </button>
          <button onClick={() => setShowForm(v => !v)}
            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors'>
            <Plus size={14} /> Manual
          </button>
          <button onClick={() => setShowGenForm(v => !v)}
            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors'>
            <Wand2 size={14} /> Gerar Turmas
          </button>
        </div>
      </div>

      {showGenForm && (
        <form onSubmit={handleGenerate} className='bg-muted rounded-xl p-4 space-y-3'>
          <p className='text-xs font-semibold'>Configuração de Geração</p>
          <div className='grid grid-cols-3 gap-3'>
            <div>
              <label className='text-xs font-medium'>Série/Ano *</label>
              <input type='number' min={1} required className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={genConfig.gradeOrYear} onChange={e => setGenConfig(f => ({ ...f, gradeOrYear: Number(e.target.value) }))} />
            </div>
            <div>
              <label className='text-xs font-medium'>Nº de Turmas *</label>
              <input type='number' min={1} required className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={genConfig.numberOfGroups} onChange={e => setGenConfig(f => ({ ...f, numberOfGroups: Number(e.target.value) }))} />
            </div>
            <div>
              <label className='text-xs font-medium'>Máx. Alunos *</label>
              <input type='number' min={1} required className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={genConfig.maxStudents} onChange={e => setGenConfig(f => ({ ...f, maxStudents: Number(e.target.value) }))} />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-xs font-medium'>Sala</label>
              <select className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={genConfig.roomId} onChange={e => setGenConfig(f => ({ ...f, roomId: e.target.value }))}>
                <option value=''>Sem sala</option>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.capacity})</option>)}
              </select>
            </div>
            <div>
              <label className='text-xs font-medium'>Turno</label>
              <select className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={genConfig.shiftId} onChange={e => setGenConfig(f => ({ ...f, shiftId: e.target.value }))}>
                <option value=''>Sem turno</option>
                {shifts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div className='flex gap-2 justify-end'>
            <button type='button' onClick={() => setShowGenForm(false)} className='px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-card transition-colors'>Cancelar</button>
            <button type='submit' disabled={actionLoading} className='px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50'>Gerar</button>
          </div>
        </form>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className='bg-muted rounded-xl p-4 space-y-3'>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-xs font-medium'>Nome *</label>
              <input required className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder='Ex: 6º Ano A' />
            </div>
            <div>
              <label className='text-xs font-medium'>Série/Ano</label>
              <input type='number' min={1} className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.gradeOrYear ?? ''} onChange={e => setForm(f => ({ ...f, gradeOrYear: e.target.value ? Number(e.target.value) : null }))} />
            </div>
          </div>
          <div className='grid grid-cols-3 gap-3'>
            <div>
              <label className='text-xs font-medium'>Máx. Alunos *</label>
              <input type='number' min={1} required className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.maxStudents} onChange={e => setForm(f => ({ ...f, maxStudents: Number(e.target.value) }))} />
            </div>
            <div>
              <label className='text-xs font-medium'>Sala</label>
              <select className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.roomId ?? ''} onChange={e => setForm(f => ({ ...f, roomId: e.target.value || null }))}>
                <option value=''>Sem sala</option>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label className='text-xs font-medium'>Turno</label>
              <select className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                value={form.shiftId ?? ''} onChange={e => setForm(f => ({ ...f, shiftId: e.target.value || null }))}>
                <option value=''>Sem turno</option>
                {shifts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div className='flex gap-2 justify-end'>
            <button type='button' onClick={() => setShowForm(false)} className='px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-card transition-colors'>Cancelar</button>
            <button type='submit' disabled={actionLoading} className='px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50'>Criar</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className='space-y-2'>{[1, 2, 3].map(i => <Skeleton key={i} className='h-16 rounded-xl' />)}</div>
      ) : classGroups.length === 0 ? (
        <div className='text-center py-12 text-muted-foreground'>
          <Users size={32} className='mx-auto mb-2 opacity-40' />
          <p className='text-sm'>Nenhuma turma criada.</p>
        </div>
      ) : (
        <div className='space-y-2'>
          {classGroups.map(g => (
            <div key={g.id} className='bg-card border border-border rounded-xl p-4 flex items-center justify-between'>
              <div>
                <p className='font-semibold text-sm'>{g.name}</p>
                <p className='text-xs text-muted-foreground'>
                  {g.gradeOrYear != null ? `${g.gradeOrYear}º Ano · ` : ''}
                  {roomMap.get(g.roomId ?? '')?.name ?? 'Sem sala'} · {shiftMap.get(g.shiftId ?? '')?.name ?? 'Sem turno'}
                </p>
              </div>
              <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                <span className='flex items-center gap-1'><Users size={12} /> {g.studentCount}/{g.maxStudents}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
