import { ProgramEdition, EDITION_STATUS_LABELS } from '../../models/programEditionModel';
import { AcademicProgram, PERIOD_TYPE_LABELS, PROGRAM_TYPE_LABELS } from '@/features/academicProgram/models/academicProgramModel';
import { CalendarDays, Users, BookOpen, Clock } from 'lucide-react';

interface Props {
  edition: ProgramEdition;
  program?: AcademicProgram;
  enrollmentCount: number;
  periodCount: number;
  groupCount: number;
}

export function OverviewTab({ edition, program, enrollmentCount, periodCount, groupCount }: Props) {
  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
        <StatCard icon={<Users size={16} />} label='Matrículas' value={enrollmentCount} />
        <StatCard icon={<Clock size={16} />} label='Períodos' value={periodCount} />
        <StatCard icon={<BookOpen size={16} />} label='Turmas' value={groupCount} />
        <StatCard icon={<CalendarDays size={16} />} label='Status' value={EDITION_STATUS_LABELS[edition.status]} />
      </div>

      <div className='bg-card border border-border rounded-xl p-5 space-y-3'>
        <h3 className='font-semibold text-sm text-muted-foreground uppercase tracking-wide'>Detalhes da Edição</h3>
        <dl className='grid grid-cols-2 gap-x-6 gap-y-2 text-sm'>
          <div><dt className='text-muted-foreground'>Programa</dt><dd className='font-medium'>{program?.name ?? '—'}</dd></div>
          <div><dt className='text-muted-foreground'>Tipo</dt><dd className='font-medium'>{program ? PROGRAM_TYPE_LABELS[program.type] : '—'}</dd></div>
          <div><dt className='text-muted-foreground'>Período</dt><dd className='font-medium'>{program ? PERIOD_TYPE_LABELS[program.periodType] : '—'}</dd></div>
          <div><dt className='text-muted-foreground'>Duração</dt><dd className='font-medium'>{program ? `${program.durationYears} ano(s)` : '—'}</dd></div>
          <div><dt className='text-muted-foreground'>Início</dt><dd className='font-medium'>{edition.startDate}</dd></div>
          <div><dt className='text-muted-foreground'>Término</dt><dd className='font-medium'>{edition.endDate}</dd></div>
          {edition.publishedAt && (
            <div><dt className='text-muted-foreground'>Publicado em</dt><dd className='font-medium'>{new Date(edition.publishedAt).toLocaleDateString('pt-BR')}</dd></div>
          )}
        </dl>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className='bg-card border border-border rounded-xl p-4 flex flex-col gap-1'>
      <div className='flex items-center gap-2 text-muted-foreground'>{icon}<span className='text-xs'>{label}</span></div>
      <span className='text-xl font-bold text-foreground'>{value}</span>
    </div>
  );
}
