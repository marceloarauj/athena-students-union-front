'use client';

import { useState } from 'react';
import { Plus, Bot } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DayLessonScheduleConfig,
  CreateDayLessonScheduleConfig,
  UpdateDayLessonScheduleConfig,
} from '../models/dayLessonScheduleConfigModel';
import { ScheduleConfigCard } from './ScheduleConfigCard';
import { ScheduleConfigForm } from './ScheduleConfigForm';
import { Discipline } from '@/features/disciplines/models/disciplineModel';

type Props = {
  configs: DayLessonScheduleConfig[];
  loading: boolean;
  disciplines: Discipline[];
  onCreate: (config: CreateDayLessonScheduleConfig) => Promise<unknown>;
  onUpdate: (id: string, config: UpdateDayLessonScheduleConfig) => Promise<unknown>;
  onToggleActive: (config: DayLessonScheduleConfig) => void;
};

export function ScheduleConfigList({
  configs,
  loading,
  disciplines,
  onCreate,
  onUpdate,
  onToggleActive,
}: Props) {
  const [editingConfig, setEditingConfig] = useState<DayLessonScheduleConfig | null>(null);
  const [showForm, setShowForm] = useState(false);

  function handleSave(data: CreateDayLessonScheduleConfig | UpdateDayLessonScheduleConfig) {
    if (editingConfig) {
      return onUpdate(editingConfig.id, data as UpdateDayLessonScheduleConfig);
    }
    return onCreate(data as CreateDayLessonScheduleConfig);
  }

  function openEdit(config: DayLessonScheduleConfig) {
    setEditingConfig(config);
    setShowForm(true);
  }

  function closeForm() {
    setEditingConfig(null);
    setShowForm(false);
  }

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-start justify-between gap-4'>
        <div>
          <p className='text-sm text-muted-foreground max-w-xl'>
            Configure os padrões de horário e frequência para a geração automática de aulas ao criar
            turmas. Você pode ter uma configuração padrão para a instituição e configurações
            específicas por disciplina.
          </p>
        </div>
        <button
          onClick={() => { setEditingConfig(null); setShowForm(true); }}
          className='flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shrink-0'
        >
          <Plus size={15} />
          Nova Configuração
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className='space-y-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-24 w-full rounded-xl' />
          ))}
        </div>
      ) : configs.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-16 text-center gap-3'>
          <div className='w-12 h-12 rounded-xl bg-muted flex items-center justify-center'>
            <Bot size={22} className='text-muted-foreground' />
          </div>
          <div>
            <p className='text-sm font-medium text-foreground'>Nenhuma configuração cadastrada</p>
            <p className='text-xs text-muted-foreground mt-1'>
              Crie uma configuração para habilitar a geração automática de aulas.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className='text-xs text-primary underline underline-offset-2'
          >
            Criar primeira configuração
          </button>
        </div>
      ) : (
        <div className='space-y-3'>
          {configs.map(config => (
            <ScheduleConfigCard
              key={config.id}
              config={config}
              onEdit={openEdit}
              onToggleActive={onToggleActive}
            />
          ))}
        </div>
      )}

      {showForm && (
        <ScheduleConfigForm
          disciplines={disciplines}
          config={editingConfig ?? undefined}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
