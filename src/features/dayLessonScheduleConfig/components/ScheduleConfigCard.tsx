'use client';

import { Clock, Pencil, Power, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { DayLessonScheduleConfig, WEEK_DAY_FLAGS } from '../models/dayLessonScheduleConfigModel';

type Props = {
  config: DayLessonScheduleConfig;
  onEdit: (config: DayLessonScheduleConfig) => void;
  onToggleActive: (config: DayLessonScheduleConfig) => void;
};

function formatDate(date: string) {
  return new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function ScheduleConfigCard({ config, onEdit, onToggleActive }: Props) {
  return (
    <Card className={`group transition-opacity ${config.isActive ? '' : 'opacity-60'}`}>
      <CardContent className='p-4'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex-1 min-w-0 space-y-3'>

            {/* Days + status */}
            <div className='flex items-center gap-2 flex-wrap'>
              <div className='flex gap-1'>
                {WEEK_DAY_FLAGS.map(day => {
                  const active = (config.daysOfWeek & day.value) !== 0;
                  return (
                    <span
                      key={day.key}
                      className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-colors ${
                        active
                          ? 'bg-primary text-white'
                          : 'bg-muted text-muted-foreground/40'
                      }`}
                    >
                      {day.label.charAt(0)}
                    </span>
                  );
                })}
              </div>
              <Badge variant={config.isActive ? 'success' : 'muted'}>
                {config.isActive ? 'Ativa' : 'Inativa'}
              </Badge>
              {!config.disciplineId && (
                <Badge variant='info' className='flex items-center gap-1'>
                  <Building2 size={10} />
                  Padrão da instituição
                </Badge>
              )}
              {config.disciplineName && (
                <Badge variant='default'>{config.disciplineName}</Badge>
              )}
            </div>

            {/* Time + period */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs'>
              <span className='flex items-center gap-1.5 text-muted-foreground'>
                <Clock size={12} className='shrink-0' />
                <span className='text-foreground font-medium'>
                  {config.lessonStartTime} → {config.lessonEndTime}
                </span>
                <span className='text-muted-foreground'>
                  · {config.timesPerWeek}× semana
                </span>
              </span>

              <span className='text-muted-foreground'>
                {formatDate(config.startDate)}
                {config.endDate ? (
                  <> → {formatDate(config.endDate)}</>
                ) : config.lessonCount ? (
                  <> · <span className='text-foreground font-medium'>máx. {config.lessonCount} aulas</span></>
                ) : null}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity'>
            <button
              onClick={() => onEdit(config)}
              title='Editar'
              className='p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors'
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onToggleActive(config)}
              title={config.isActive ? 'Desativar' : 'Ativar'}
              className={`p-2 rounded-lg transition-colors ${
                config.isActive
                  ? 'text-muted-foreground hover:text-danger hover:bg-muted'
                  : 'text-muted-foreground hover:text-emerald-600 hover:bg-muted'
              }`}
            >
              <Power size={14} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
