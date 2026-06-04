'use client';

import { BookOpen } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useClassGradeEntry } from '@/features/gradeEntry/hooks/useClassGradeEntry';
import type { SchoolClass } from '../models/classSetupModel';

type Props = {
  schoolClass: SchoolClass;
  institution: string;
  onClose: () => void;
};

const BIMESTRES = ['b1', 'b2', 'b3', 'b4'] as const;

function calcAvg(b1: number | null, b2: number | null, b3: number | null, b4: number | null) {
  const vals = [b1, b2, b3, b4].filter((v): v is number => v !== null);
  if (vals.length === 0) return null;
  return (vals.reduce((a, b) => a + b, 0) / vals.length);
}

export function ClassGradeEntryModal({ schoolClass, institution, onClose }: Props) {
  const { students, loading, saving, updateGrade, saveAll } = useClassGradeEntry(institution, schoolClass.id);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <BookOpen size={16} className='text-primary' />
            Diário de Notas
          </DialogTitle>
          <DialogDescription>
            {schoolClass.name} — {schoolClass.discipline} · Prof. {schoolClass.teacher}
          </DialogDescription>
        </DialogHeader>

        <div className='overflow-x-auto'>
          {loading ? (
            <div className='space-y-2 py-2'>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className='h-10 w-full rounded-lg' />
              ))}
            </div>
          ) : students.length === 0 ? (
            <p className='text-sm text-muted-foreground text-center py-8'>
              Nenhum aluno matriculado nesta turma.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='min-w-[160px]'>Aluno</TableHead>
                  <TableHead className='w-28 text-muted-foreground'>Matrícula</TableHead>
                  {BIMESTRES.map(b => (
                    <TableHead key={b} className='w-20 text-center uppercase'>{b}</TableHead>
                  ))}
                  <TableHead className='w-20 text-center'>Média</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(s => {
                  const avg = calcAvg(s.b1, s.b2, s.b3, s.b4);
                  const avgColor =
                    avg === null ? '' :
                    avg >= 7 ? 'text-green-600 dark:text-green-400' :
                    avg >= 5 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-danger';
                  return (
                    <TableRow key={s.studentId}>
                      <TableCell className='font-medium text-sm'>{s.studentName}</TableCell>
                      <TableCell className='text-xs text-muted-foreground'>{s.matricula}</TableCell>
                      {BIMESTRES.map(b => (
                        <TableCell key={b} className='p-1.5 text-center'>
                          <input
                            type='number'
                            min={0}
                            max={10}
                            step={0.1}
                            value={s[b] ?? ''}
                            onChange={e => {
                              const v = e.target.value === '' ? null : Number(e.target.value);
                              updateGrade(s.studentId, b, v);
                            }}
                            className='w-16 text-center bg-input border border-border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary'
                          />
                        </TableCell>
                      ))}
                      <TableCell className={`text-center font-semibold text-sm ${avgColor}`}>
                        {avg !== null ? avg.toFixed(1) : '—'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            className='px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors'
          >
            Fechar
          </button>
          <button
            onClick={saveAll}
            disabled={saving || loading || students.length === 0}
            className='px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors'
          >
            {saving ? 'Salvando...' : 'Salvar Notas'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
