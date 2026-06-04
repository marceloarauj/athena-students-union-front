'use client';

import { useEffect, useState } from 'react';
import { Holiday, Recess, CreateHolidayDto, CreateRecessDto } from '../models/holidayModel';
import { getHolidayService } from '../services/holidayInterface';
import { toast } from 'sonner';

export function useHoliday(institution: string, year?: number) {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const service = getHolidayService(institution);

  useEffect(() => {
    service.list(year).then(data => {
      setHolidays(data);
      setLoading(false);
    });
  }, [institution, year]);

  async function createHoliday(dto: CreateHolidayDto) {
    const created = await service.create(dto);
    setHolidays(prev => [...prev, created]);
    toast.success('Feriado criado.');
    return created;
  }

  async function deleteHoliday(id: string) {
    await service.delete(id);
    setHolidays(prev => prev.filter(h => h.id !== id));
    toast.success('Feriado removido.');
  }

  return { holidays, loading, createHoliday, deleteHoliday };
}

export function useRecesses(institution: string, editionId: string) {
  const [recesses, setRecesses] = useState<Recess[]>([]);
  const [loading, setLoading] = useState(true);
  const service = getHolidayService(institution);

  useEffect(() => {
    if (!editionId) return;
    service.listRecesses(editionId).then(data => {
      setRecesses(data);
      setLoading(false);
    });
  }, [institution, editionId]);

  async function createRecess(dto: CreateRecessDto) {
    const created = await service.createRecess(dto);
    setRecesses(prev => [...prev, created]);
    toast.success('Recesso criado.');
    return created;
  }

  return { recesses, loading, createRecess };
}
