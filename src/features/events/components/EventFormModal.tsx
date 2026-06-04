'use client';

import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { CalendarEvent, EventType } from '../models/eventModel';
import { EVENT_TYPE_CONFIG } from '../models/eventModel';

type Props = {
  event?: CalendarEvent;
  onSave: (e: Omit<CalendarEvent, 'id'> | CalendarEvent) => Promise<void>;
  onClose: () => void;
};

const today = new Date().toISOString().split('T')[0];

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type='button'
      role='switch'
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${
        checked ? 'bg-primary' : 'bg-muted border border-border'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export function EventFormModal({ event, onSave, onClose }: Props) {
  const isEditing = event !== undefined;

  const [title, setTitle] = useState(event?.title ?? '');
  const [type, setType] = useState<EventType>(event?.type ?? 'outro');
  const [description, setDescription] = useState(event?.description ?? '');
  const [allDay, setAllDay] = useState(event?.allDay ?? false);
  const [startDate, setStartDate] = useState(event?.startDate ?? today);
  const [endDate, setEndDate] = useState(event?.endDate ?? today);
  const [startTime, setStartTime] = useState(event?.startTime ?? '08:00');
  const [endTime, setEndTime] = useState(event?.endTime ?? '09:00');
  const [saving, setSaving] = useState(false);

  const isValid = title.trim().length > 0 && startDate.length > 0 && endDate >= startDate;

  function handleAllDayChange(v: boolean) {
    setAllDay(v);
  }

  function handleStartDateChange(v: string) {
    setStartDate(v);
    if (endDate < v) setEndDate(v);
  }

  async function handleSave() {
    if (!isValid) return;
    setSaving(true);
    const data: Omit<CalendarEvent, 'id'> = {
      title: title.trim(),
      type,
      description: description.trim(),
      allDay,
      startDate,
      endDate,
      ...(!allDay && { startTime, endTime: endTime || undefined }),
    };
    await onSave(isEditing ? { ...data, id: event.id } : data);
    setSaving(false);
    onClose();
  }

  const typeConfig = EVENT_TYPE_CONFIG[type];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-sm sm:max-w-lg max-h-[92vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <CalendarDays size={16} className='text-primary' />
            {isEditing ? 'Editar Evento' : 'Novo Evento'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Atualize os dados do evento.' : 'Preencha os dados para cadastrar um novo evento.'}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Title */}
          <div>
            <label className='text-sm font-medium block mb-1'>
              Título <span className='text-danger'>*</span>
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder='Ex: Reunião de Pais e Mestres'
              className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
            />
          </div>

          {/* Type */}
          <div>
            <label className='text-sm font-medium block mb-1'>Tipo de Evento</label>
            <Select value={type} onValueChange={v => setType(v as EventType)}>
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(EVENT_TYPE_CONFIG) as [EventType, typeof typeConfig][]).map(([key, cfg]) => (
                  <SelectItem key={key} value={key}>
                    <span className='flex items-center gap-2'>
                      <span
                        className='w-2.5 h-2.5 rounded-full shrink-0'
                        style={{ backgroundColor: cfg.color }}
                      />
                      {cfg.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <label className='text-sm font-medium block mb-1'>Descrição</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Descreva o evento, local, informações importantes...'
              rows={3}
              className='w-full px-3 py-2 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none'
            />
          </div>

          {/* All day toggle */}
          <div className='flex items-center justify-between p-3 rounded-xl border border-border'>
            <div>
              <p className='text-sm font-medium'>Dia inteiro</p>
              <p className='text-xs text-muted-foreground mt-0.5'>O evento ocupa o dia todo, sem horário definido.</p>
            </div>
            <ToggleSwitch checked={allDay} onChange={handleAllDayChange} />
          </div>

          {/* Date + Time */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <div>
              <label className='text-sm font-medium block mb-1'>
                Data de início <span className='text-danger'>*</span>
              </label>
              <input
                type='date'
                value={startDate}
                onChange={e => handleStartDateChange(e.target.value)}
                className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
              />
            </div>
            <div>
              <label className='text-sm font-medium block mb-1'>Data de término</label>
              <input
                type='date'
                value={endDate}
                min={startDate}
                onChange={e => setEndDate(e.target.value)}
                className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
              />
            </div>

            {!allDay && (
              <>
                <div>
                  <label className='text-sm font-medium block mb-1'>Horário de início</label>
                  <input
                    type='time'
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
                  />
                </div>
                <div>
                  <label className='text-sm font-medium block mb-1'>Horário de término</label>
                  <input
                    type='time'
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className='w-full h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
                  />
                </div>
              </>
            )}
          </div>

          {/* Preview */}
          <div
            className='flex items-center gap-3 p-3 rounded-xl border-l-4'
            style={{
              borderLeftColor: typeConfig.color,
              backgroundColor: `${typeConfig.color}0d`,
              borderTopColor: 'var(--border)',
              borderRightColor: 'var(--border)',
              borderBottomColor: 'var(--border)',
              borderWidth: '1px',
              borderLeftWidth: '4px',
            }}
          >
            <div className='min-w-0 flex-1'>
              <div className='flex items-center gap-2 mb-0.5'>
                <span
                  className='text-xs px-2 py-0.5 rounded-full font-medium'
                  style={{ backgroundColor: `${typeConfig.color}20`, color: typeConfig.color }}
                >
                  {typeConfig.label}
                </span>
                {allDay && (
                  <span className='text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground'>
                    Dia inteiro
                  </span>
                )}
              </div>
              <p className='text-sm font-semibold text-foreground truncate'>
                {title || 'Título do evento'}
              </p>
              <p className='text-xs text-muted-foreground mt-0.5'>
                {startDate}
                {endDate !== startDate && ` → ${endDate}`}
                {!allDay && startTime && ` · ${startTime}${endTime ? `–${endTime}` : ''}`}
              </p>
            </div>
          </div>
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
            {saving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Cadastrar Evento'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
