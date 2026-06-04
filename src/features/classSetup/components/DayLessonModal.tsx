'use client';

import { useState } from 'react';
import { BookOpen, CheckCircle, Clock, Plus, Trash2, Users, XCircle } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useDayLesson } from '@/features/dayLesson/hooks/useDayLesson';
import { AttendanceStatus } from '@/features/dayLesson/models/dayLessonModel';
import type { SchoolClass } from '../models/classSetupModel';

type Props = {
  schoolClass: SchoolClass;
  institution: string;
  onClose: () => void;
};

const STATUS_OPTIONS: { value: AttendanceStatus; label: string; colors: string }[] = [
  { value: 'present', label: 'Presente',  colors: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700' },
  { value: 'late',    label: 'Atrasado',  colors: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-300 dark:border-amber-700' },
  { value: 'absent',  label: 'Faltou',    colors: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-700' },
];

const STATUS_ICONS: Record<AttendanceStatus, React.ReactNode> = {
  present: <CheckCircle size={12} />,
  late:    <Clock size={12} />,
  absent:  <XCircle size={12} />,
};

export function DayLessonModal({ schoolClass, institution, onClose }: Props) {
  const { lesson, date, setDate, loading, saving, addContent, removeContent, updateStudentStatus, markAllPresent, save } =
    useDayLesson(institution, schoolClass.id);
  const [newContent, setNewContent] = useState('');

  const present = lesson?.students.filter(s => s.status === 'present').length ?? 0;
  const absent  = lesson?.students.filter(s => s.status === 'absent').length ?? 0;
  const late    = lesson?.students.filter(s => s.status === 'late').length ?? 0;

  function handleAddContent() {
    if (!newContent.trim()) return;
    addContent(newContent);
    setNewContent('');
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <BookOpen size={16} className='text-primary' />
            Aula do Dia
          </DialogTitle>
          <DialogDescription>
            {schoolClass.name} — {schoolClass.discipline} · Prof. {schoolClass.teacher}
          </DialogDescription>
        </DialogHeader>

        <div className='flex items-center gap-2'>
          <label className='text-xs font-medium text-muted-foreground shrink-0'>Data:</label>
          <input
            type='date'
            value={date}
            onChange={e => setDate(e.target.value)}
            className='h-8 px-2 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
          />
        </div>

        <Tabs defaultValue='contents'>
          <TabsList>
            <TabsTrigger value='contents' className='flex items-center gap-1.5'>
              <BookOpen size={13} />
              Conteúdo
              {lesson && lesson.contents.length > 0 && (
                <span className='ml-1 text-[10px] bg-primary text-white rounded-full px-1.5 py-0.5 font-semibold'>
                  {lesson.contents.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value='attendance' className='flex items-center gap-1.5'>
              <Users size={13} />
              Chamada
              {lesson && lesson.students.length > 0 && (
                <span className='ml-1 text-[10px] bg-primary text-white rounded-full px-1.5 py-0.5 font-semibold'>
                  {lesson.students.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Conteúdo ── */}
          <TabsContent value='contents' className='space-y-3 mt-3'>
            <div className='flex gap-2'>
              <input
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddContent()}
                placeholder='Adicionar conteúdo da aula...'
                className='flex-1 h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
              />
              <button
                onClick={handleAddContent}
                disabled={!newContent.trim()}
                className='flex items-center gap-1 px-3 py-2 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary/90 disabled:opacity-40 transition-colors'
              >
                <Plus size={14} /> Adicionar
              </button>
            </div>

            {loading ? (
              <div className='space-y-2'>
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className='h-9 w-full rounded-lg' />)}
              </div>
            ) : lesson?.contents.length === 0 ? (
              <p className='text-sm text-muted-foreground text-center py-6'>
                Nenhum conteúdo registrado para esta aula.
              </p>
            ) : (
              <ol className='space-y-2'>
                {lesson?.contents.map((c, i) => (
                  <li key={i} className='flex items-center gap-3 px-3 py-2 rounded-lg bg-muted group'>
                    <span className='text-xs font-bold text-muted-foreground w-5 shrink-0'>{i + 1}.</span>
                    <span className='flex-1 text-sm text-foreground'>{c}</span>
                    <button
                      onClick={() => removeContent(i)}
                      className='opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-danger hover:bg-card transition-all'
                    >
                      <Trash2 size={13} />
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </TabsContent>

          {/* ── Chamada ── */}
          <TabsContent value='attendance' className='space-y-3 mt-3'>
            {!loading && lesson && lesson.students.length > 0 && (
              <div className='flex items-center justify-between'>
                <div className='flex gap-4 text-xs'>
                  <span className='text-emerald-600 dark:text-emerald-400 font-semibold'>{present} presentes</span>
                  <span className='text-amber-500 font-semibold'>{late} atrasados</span>
                  <span className='text-danger font-semibold'>{absent} ausentes</span>
                </div>
                <button
                  onClick={markAllPresent}
                  className='text-xs text-primary hover:underline font-medium'
                >
                  Marcar todos presentes
                </button>
              </div>
            )}

            {loading ? (
              <div className='space-y-2'>
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className='h-12 w-full rounded-lg' />)}
              </div>
            ) : lesson?.students.length === 0 ? (
              <p className='text-sm text-muted-foreground text-center py-6'>
                Nenhum aluno matriculado nesta turma para esta data.
              </p>
            ) : (
              <div className='divide-y divide-border rounded-xl border border-border overflow-hidden max-h-[380px] overflow-y-auto'>
                {lesson?.students.map(s => (
                  <div key={s.studentId} className='flex items-center justify-between px-4 py-2.5 bg-card'>
                    <div>
                      <p className='text-sm font-medium text-foreground'>{s.studentName}</p>
                      <p className='text-xs text-muted-foreground'>{s.matricula}</p>
                    </div>
                    <div className='flex gap-1.5'>
                      {STATUS_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => updateStudentStatus(s.studentId, opt.value)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-colors ${
                            s.status === opt.value
                              ? opt.colors
                              : 'border-border text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {STATUS_ICONS[opt.value]}
                          <span className='hidden sm:inline'>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <button
            onClick={onClose}
            className='px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors'
          >
            Fechar
          </button>
          <button
            onClick={save}
            disabled={saving || loading}
            className='px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors'
          >
            {saving ? 'Salvando...' : 'Salvar Aula'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
