'use client';

import { useInstitutionStore } from '@/entities/institution';
import { useGrades } from '@/features/grades/hooks/useGrades';
import { usePermissionGuard } from '@/features/auth/hooks/usePermissionGuard';
import { GradeReport, GradeStatus } from '@/features/grades/models/gradeModel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

const statusMap: Record<GradeStatus, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  approved: { label: 'Aprovado', variant: 'success' },
  warning: { label: 'Atenção', variant: 'warning' },
  danger: { label: 'Reprovado', variant: 'danger' },
};

function GradeCell({ value }: { value: number }) {
  const color =
    value >= 7 ? 'text-emerald-600 dark:text-emerald-400' :
    value >= 5 ? 'text-amber-600 dark:text-amber-400' :
    'text-danger';
  return <span className={`font-semibold ${color}`}>{value.toFixed(1)}</span>;
}

export default function GradesPage() {
  const allowed = usePermissionGuard('SHOW_SCREEN_SCORE');
  const { institution } = useInstitutionStore();
  const { grades, loading } = useGrades(institution?.alias ?? '');

  if (!allowed) return null;

  const avg = grades.length > 0
    ? grades.reduce((s, g) => s + g.average, 0) / grades.length
    : 0;
  const highest = grades.length > 0 ? Math.max(...grades.map(g => g.average)) : 0;
  const lowest = grades.length > 0 ? Math.min(...grades.map(g => g.average)) : 0;

  return (
    <div className='p-6 max-w-4xl mx-auto space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-foreground'>Boletim Escolar</h1>
        <p className='text-sm text-muted-foreground mt-1'>Acompanhe seu desempenho acadêmico.</p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-3 gap-4'>
        {[
          { label: 'Média Geral', value: avg.toFixed(1) },
          { label: 'Melhor Nota', value: highest.toFixed(1) },
          { label: 'Menor Nota', value: lowest.toFixed(1) },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className='p-4 text-center'>
              <p className='text-2xl font-bold text-primary'>{stat.value}</p>
              <p className='text-xs text-muted-foreground mt-1'>{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Notas por Disciplina</CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          {loading ? (
            <div className='p-4 space-y-3'>
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className='h-10 w-full' />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disciplina</TableHead>
                  <TableHead className='text-center'>B1</TableHead>
                  <TableHead className='text-center'>B2</TableHead>
                  <TableHead className='text-center'>B3</TableHead>
                  <TableHead className='text-center'>B4</TableHead>
                  <TableHead className='text-center'>Média</TableHead>
                  <TableHead className='text-center'>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((g: GradeReport) => {
                  const { label, variant } = statusMap[g.status];
                  return (
                    <TableRow key={g.subject}>
                      <TableCell className='font-medium'>{g.subject}</TableCell>
                      <TableCell className='text-center'><GradeCell value={g.b1} /></TableCell>
                      <TableCell className='text-center'><GradeCell value={g.b2} /></TableCell>
                      <TableCell className='text-center'><GradeCell value={g.b3} /></TableCell>
                      <TableCell className='text-center'><GradeCell value={g.b4} /></TableCell>
                      <TableCell className='text-center'><GradeCell value={g.average} /></TableCell>
                      <TableCell className='text-center'>
                        <Badge variant={variant}>{label}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
