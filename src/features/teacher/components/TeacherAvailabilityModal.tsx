'use client';

import { useState } from 'react';
import { Teacher, DAY_OF_WEEK_LABELS, SetTeacherAvailabilityDto } from '../models/teacherModel';
import { Shift } from '@/features/shift/models/shiftModel';

interface Props {
  teacher: Teacher;
  shifts: Shift[];
  onSave: (teacherId: string, dto: SetTeacherAvailabilityDto) => Promise<unknown>;
  onClose: () => void;
}

const DAYS = [1, 2, 3, 4, 5, 6, 0];

export function TeacherAvailabilityModal({ teacher, shifts, onSave, onClose }: Props) {
  const [selected, setSelected] = useState<{ dayOfWeek: number; shiftId: string }[]>(
    teacher.availability?.map(a => ({ dayOfWeek: a.dayOfWeek, shiftId: a.shiftId })) ?? []
  );
  const [saving, setSaving] = useState(false);

  function toggleSlot(dayOfWeek: number, shiftId: string) {
    const idx = selected.findIndex(s => s.dayOfWeek === dayOfWeek && s.shiftId === shiftId);
    if (idx >= 0) setSelected(prev => prev.filter((_, i) => i !== idx));
    else setSelected(prev => [...prev, { dayOfWeek, shiftId }]);
  }

  function isSelected(dayOfWeek: number, shiftId: string) {
    return selected.some(s => s.dayOfWeek === dayOfWeek && s.shiftId === shiftId);
  }

  async function handleSave() {
    setSaving(true);
    try { await onSave(teacher.id, { availabilities: selected }); onClose(); } finally { setSaving(false); }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-card border border-border rounded-xl shadow-xl w-full max-w-lg p-6'>
        <h2 className='text-lg font-bold mb-1'>Disponibilidade</h2>
        <p className='text-sm text-muted-foreground mb-4'>{teacher.name}</p>
        <div className='overflow-x-auto'>
          <table className='w-full text-xs'>
            <thead>
              <tr>
                <th className='text-left py-1 pr-3 font-medium text-muted-foreground'>Dia</th>
                {shifts.map(s => (
                  <th key={s.id} className='text-center px-2 font-medium text-muted-foreground'>{s.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map(day => (
                <tr key={day} className='border-t border-border'>
                  <td className='py-2 pr-3 font-medium text-foreground'>{DAY_OF_WEEK_LABELS[day]}</td>
                  {shifts.map(s => (
                    <td key={s.id} className='text-center px-2'>
                      <button
                        onClick={() => toggleSlot(day, s.id)}
                        className={`w-7 h-7 rounded-md border transition-colors ${isSelected(day, s.id) ? 'bg-primary border-primary text-white' : 'border-border hover:bg-muted'}`}
                      >
                        {isSelected(day, s.id) ? '✓' : ''}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='flex gap-3 justify-end pt-4'>
          <button onClick={onClose} className='px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors'>Cancelar</button>
          <button onClick={handleSave} disabled={saving} className='px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50'>
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
