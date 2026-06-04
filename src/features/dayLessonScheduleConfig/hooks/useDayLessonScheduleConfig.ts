'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  DayLessonScheduleConfig,
  CreateDayLessonScheduleConfig,
  UpdateDayLessonScheduleConfig,
} from '../models/dayLessonScheduleConfigModel';
import { getDayLessonScheduleConfigService } from '../services/dayLessonScheduleConfigInterface';

export function useDayLessonScheduleConfig(institution: string) {
  const [configs, setConfigs] = useState<DayLessonScheduleConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const service = getDayLessonScheduleConfigService(institution);

  useEffect(() => {
    service.getConfigs().then(data => {
      setConfigs(data);
      setLoading(false);
    });
  }, [institution]);

  async function createConfig(config: CreateDayLessonScheduleConfig) {
    const created = await service.createConfig(config);
    setConfigs(prev => [created, ...prev]);
    toast.success('Configuração criada com sucesso.');
    return created;
  }

  async function updateConfig(id: string, config: UpdateDayLessonScheduleConfig) {
    const updated = await service.updateConfig(id, config);
    setConfigs(prev => prev.map(c => (c.id === id ? updated : c)));
    toast.success('Configuração atualizada.');
    return updated;
  }

  async function toggleActive(id: string, currentlyActive: boolean) {
    const updated = await service.updateConfig(id, { isActive: !currentlyActive });
    setConfigs(prev => prev.map(c => (c.id === id ? updated : c)));
    toast.success(updated.isActive ? 'Configuração ativada.' : 'Configuração desativada.');
  }

  return { configs, loading, createConfig, updateConfig, toggleActive };
}
