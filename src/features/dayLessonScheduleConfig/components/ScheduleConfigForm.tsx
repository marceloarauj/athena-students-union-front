'use client';

import { useState } from 'react';
import { Clock, CalendarRange, Layers, Info } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  WEEK_DAY_FLAGS,
  DayLessonScheduleConfig,
  CreateDayLessonScheduleConfig,
  UpdateDayLessonScheduleConfig,
  countDaysInWeek,
} from '../models/dayLessonScheduleConfigModel';
import { Discipline } from '@/features/disciplines/models/disciplineModel';

type TerminationMode = 'endDate' | 'lessonCount';

type Props = {
  disciplines: Discipline[];
  config?: DayLessonScheduleConfig;
  onSave: (data: CreateDayLessonScheduleConfig | UpdateDayLessonScheduleConfig) => Promise<unknown>;
  onClose: () => void;
};

export function ScheduleConfigForm({ disciplines, config, onSave, onClose }: Props) {
  const isEditing = config !== undefined;

  const [startDate, setStartDate] = useState(config?.startDate ?? '');
  const [terminationMode, setTerminationMode] = useState<TerminationMode>(
    config?.lessonCount ? 'lessonCount' : 'endDate',
  );
  const [endDate, setEndDate] = useState(config?.endDate ?? '');
  const [lessonCount, setLessonCount] = useState<string>(
    config?.lessonCount ? String(config.lessonCount) : '',
  );
  const [lessonStartTime, setLessonStartTime] = useState(config?.lessonStartTime ?? '08:00');
  const [lessonEndTime, setLessonEndTime] = useState(config?.lessonEndTime ?? '09:40');
  const [daysOfWeek, setDaysOfWeek] = useState<number>(config?.daysOfWeek ?? 0);
  const [disciplineId, setDisciplineId] = useState<string>(config?.disciplineId ?? '');
  const [saving, setSaving] = useState(false);

  function toggleDay(value: number) {
    setDaysOfWeek(prev => (prev & value ? prev & ~value : prev | value));
  }

  const timesPerWeek = countDaysInWeek(daysOfWeek);

  const isValid =
    startDate.length > 0 &&
    lessonStartTime.length > 0 &&
    lessonEndTime.length > 0 &&
    lessonStartTime < lessonEndTime &&
    daysOfWeek > 0 &&
    (terminationMode === 'endDate' ? endDate.length > 0 : Number(lessonCount) > 0);

  async function handleSave() {
    if (!isValid) return;
    setSaving(true);
    try {
      const payload: CreateDayLessonScheduleConfig = {
        startDate,
        endDate: terminationMode === 'endDate' ? endDate : undefined,
        lessonStartTime,
        lessonEndTime,
        daysOfWeek,
        lessonCount: terminationMode === 'lessonCount' ? Number(lessonCount) : undefined,
        disciplineId: disciplineId || undefined,
      };
      await onSave(payload);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-sm sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <CalendarRange size={16} className='text-primary' />
            {isEditing ? 'Editar Configuração' : 'Nova Configuração de Automação'}
          </DialogTitle>
          <DialogDescription>
            Define os dias, horários e período para geração automática de aulas ao criar turmas.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-5'>
          {/* Days of week */}
          <div>
            <label className='text-sm font-medium block mb-2'>
              Dias da semana <span className='text-danger'>*</span>
            </label>
            <div className='flex gap-1.5 flex-wrap'>
              {WEEK_DAY_FLAGS.map(day => {
                const active = (daysOfWeek & day.value) !== 0;
                return (
                  <button
                    key={day.key}
                    type='button'
                    onClick={() => toggleDay(day.value)}
                    className={`w-10 h-10 rounded-full text-xs font-semibold transition-all border ${
                      active
                        ? 'bg-primary text-white border-primary shadow-sm scale-105'
                        : 'bg-muted text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
            {timesPerWeek > 0 && (
              <p className='text-xs text-muted-foreground mt-2'>
                {timesPerWeek}× por semana
              </p>
            )}
          </div>

          {/* Time range */}
          <div>
            <label className='text-sm font-medium flex items-center gap-1.5 mb-2'>
              <Clock size={14} className='text-muted-foreground' />
              Horário da aula <span className='text-danger'>*</span>
            </label>
            <div className='flex items-center gap-3'>
              <div className='flex-1'>
                <p className='text-xs text-muted-foreground mb-1'>Início</p>
                <input
                  type='time'
                  value={lessonStartTime}
                  onChange={e => setLessonStartTime(e.target.value)}
                  className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
                />
              </div>
              <span className='text-muted-foreground mt-5'>→</span>
              <div className='flex-1'>
                <p className='text-xs text-muted-foreground mb-1'>Fim</p>
                <input
                  type='time'
                  value={lessonEndTime}
                  onChange={e => setLessonEndTime(e.target.value)}
                  className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
                />
              </div>
            </div>
            {lessonStartTime && lessonEndTime && lessonStartTime >= lessonEndTime && (
              <p className='text-xs text-danger mt-1'>O horário de fim deve ser posterior ao início.</p>
            )}
          </div>

          {/* Period */}
          <div>
            <label className='text-sm font-medium block mb-2'>
              Período <span className='text-danger'>*</span>
            </label>
            <div className='space-y-3'>
              <div>
                <p className='text-xs text-muted-foreground mb-1'>Data de início</p>
                <input
                  type='date'
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
                />
              </div>

              <div className='flex gap-2 p-1 bg-muted rounded-lg'>
                <button
                  type='button'
                  onClick={() => setTerminationMode('endDate')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                    terminationMode === 'endDate'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Data final
                </button>
                <button
                  type='button'
                  onClick={() => setTerminationMode('lessonCount')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                    terminationMode === 'lessonCount'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Nº de aulas
                </button>
              </div>

              {terminationMode === 'endDate' ? (
                <div>
                  <p className='text-xs text-muted-foreground mb-1'>Data de fim</p>
                  <input
                    type='date'
                    value={endDate}
                    min={startDate}
                    onChange={e => setEndDate(e.target.value)}
                    className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
                  />
                </div>
              ) : (
                <div>
                  <p className='text-xs text-muted-foreground mb-1'>Quantidade máxima de aulas</p>
                  <input
                    type='number'
                    min={1}
                    value={lessonCount}
                    onChange={e => setLessonCount(e.target.value)}
                    placeholder='Ex: 60'
                    className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
                  />
                </div>
              )}
            </div>
          </div>

          {/* Discipline (optional) */}
          <div>
            <label className='text-sm font-medium flex items-center gap-1.5 mb-2'>
              <Layers size={14} className='text-muted-foreground' />
              Disciplina
            </label>
            <select
              value={disciplineId}
              onChange={e => setDisciplineId(e.target.value)}
              className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
            >
              <option value=''>Padrão da Instituição</option>
              {disciplines.map(d => (
                <option key={d.id} value={String(d.id)}>
                  {d.name}
                </option>
              ))}
            </select>
            <p className='text-xs text-muted-foreground mt-1.5 flex items-center gap-1'>
              <Info size={11} />
              Sem disciplina selecionada, esta configuração é o padrão para todas as turmas.
            </p>
          </div>

          {/* Summary preview */}
          {isValid && (
            <div className='p-3 rounded-xl border border-primary/20 bg-primary/5 text-sm space-y-0.5'>
              <p className='font-medium text-foreground text-xs mb-1.5'>Resumo da configuração</p>
              <p className='text-xs text-muted-foreground'>
                <span className='text-foreground font-medium'>{timesPerWeek}× por semana</span>
                {' '}das{' '}
                <span className='text-foreground font-medium'>{lessonStartTime}</span>
                {' '}às{' '}
                <span className='text-foreground font-medium'>{lessonEndTime}</span>
              </p>
              <p className='text-xs text-muted-foreground'>
                A partir de{' '}
                <span className='text-foreground font-medium'>
                  {startDate ? new Date(startDate + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}
                </span>
                {terminationMode === 'endDate' && endDate ? (
                  <> até{' '}
                    <span className='text-foreground font-medium'>
                      {new Date(endDate + 'T12:00:00').toLocaleDateString('pt-BR')}
                    </span>
                  </>
                ) : terminationMode === 'lessonCount' && lessonCount ? (
                  <> · máx. <span className='text-foreground font-medium'>{lessonCount} aulas</span></>
                ) : null}
              </p>
              {disciplineId ? (
                <p className='text-xs text-muted-foreground'>
                  Disciplina:{' '}
                  <span className='text-foreground font-medium'>
                    {disciplines.find(d => String(d.id) === disciplineId)?.name}
                  </span>
                </p>
              ) : (
                <p className='text-xs text-muted-foreground'>Padrão da instituição</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            className='px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors'
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !isValid}
            className='px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors'
          >
            {saving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Configuração'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
