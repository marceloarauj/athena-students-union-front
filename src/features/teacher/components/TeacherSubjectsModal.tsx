'use client';

import { useState, useEffect } from 'react';
import { Teacher, SetTeacherSubjectsDto } from '../models/teacherModel';
import { AcademicProgram } from '@/features/academicProgram/models/academicProgramModel';
import { Subject } from '@/features/subject/models/subjectModel';
import { getSubjectService } from '@/features/subject/services/subjectInterface';

interface Props {
  teacher: Teacher;
  programs: AcademicProgram[];
  institution: string;
  onSave: (teacherId: string, dto: SetTeacherSubjectsDto) => Promise<unknown>;
  onClose: () => void;
}

export function TeacherSubjectsModal({ teacher, programs, institution, onSave, onClose }: Props) {
  const [selectedProgram, setSelectedProgram] = useState(programs[0]?.id ?? '');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set(teacher.subjects ?? []));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedProgram) return;
    getSubjectService(institution).listByProgram(selectedProgram).then(setSubjects);
  }, [selectedProgram, institution]);

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    try { await onSave(teacher.id, { subjectIds: Array.from(selected) }); onClose(); } finally { setSaving(false); }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6'>
        <h2 className='text-lg font-bold mb-1'>Disciplinas do Professor</h2>
        <p className='text-sm text-muted-foreground mb-4'>{teacher.name}</p>

        <div className='mb-3'>
          <label className='text-xs font-medium text-muted-foreground'>Programa</label>
          <select
            className='mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
            value={selectedProgram}
            onChange={e => setSelectedProgram(e.target.value)}
          >
            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div className='space-y-1.5 max-h-52 overflow-y-auto pr-1'>
          {subjects.length === 0 ? (
            <p className='text-xs text-muted-foreground py-4 text-center'>Nenhuma matéria neste programa.</p>
          ) : subjects.map(s => (
            <label key={s.id} className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted cursor-pointer transition-colors'>
              <input
                type='checkbox'
                className='w-4 h-4 accent-primary'
                checked={selected.has(s.id)}
                onChange={() => toggle(s.id)}
              />
              <span className='text-xs font-mono text-primary font-medium w-10'>{s.code}</span>
              <span className='text-sm'>{s.name}</span>
            </label>
          ))}
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
