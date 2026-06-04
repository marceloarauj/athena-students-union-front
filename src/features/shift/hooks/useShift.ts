'use client';

import { useEffect, useState } from 'react';
import { Shift, ScheduleSlot, CreateShiftDto, AddScheduleSlotDto } from '../models/shiftModel';
import { getShiftService } from '../services/shiftInterface';
import { toast } from 'sonner';

export function useShift(institution: string) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const service = getShiftService(institution);

  useEffect(() => {
    service.list().then(data => {
      setShifts(data);
      setLoading(false);
    });
  }, [institution]);

  async function createShift(dto: CreateShiftDto) {
    const created = await service.create(dto);
    setShifts(prev => [...prev, created]);
    toast.success('Turno criado.');
    return created;
  }

  async function addSlot(shiftId: string, dto: AddScheduleSlotDto) {
    const slot = await service.addSlot(shiftId, dto);
    setShifts(prev => prev.map(s =>
      s.id === shiftId ? { ...s, slots: [...(s.slots ?? []), slot] } : s
    ));
    toast.success('Horário adicionado.');
    return slot;
  }

  return { shifts, loading, createShift, addSlot };
}
