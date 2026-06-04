import { IShiftService } from './shiftInterface';
import { Shift, ScheduleSlot, CreateShiftDto, AddScheduleSlotDto } from '../models/shiftModel';

export class ShiftService implements IShiftService {
  async list(): Promise<Shift[]> {
    const res = await fetch('/api/shift');
    if (!res.ok) return [];
    return res.json();
  }

  async create(dto: CreateShiftDto): Promise<Shift> {
    const res = await fetch('/api/shift', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    return res.json();
  }

  async addSlot(shiftId: string, dto: AddScheduleSlotDto): Promise<ScheduleSlot> {
    const res = await fetch(`/api/shift/${shiftId}/slots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    return res.json();
  }

  async listSlots(shiftId: string): Promise<ScheduleSlot[]> {
    const res = await fetch(`/api/shift/${shiftId}/slots`);
    if (!res.ok) return [];
    return res.json();
  }
}
