import { IShiftService } from './shiftInterface';
import { Shift, ScheduleSlot, CreateShiftDto, AddScheduleSlotDto } from '../models/shiftModel';
import data from '@/seeds/shifts_data.json';

let store: Shift[] = data as Shift[];

export class ShiftMockService implements IShiftService {
  async list(): Promise<Shift[]> {
    return store;
  }

  async create(dto: CreateShiftDto): Promise<Shift> {
    const shift: Shift = {
      ...dto,
      id: crypto.randomUUID(),
      isActive: true,
      createdAt: new Date().toISOString(),
      slots: [],
    };
    store = [...store, shift];
    return shift;
  }

  async addSlot(shiftId: string, dto: AddScheduleSlotDto): Promise<ScheduleSlot> {
    const slot: ScheduleSlot = {
      ...dto,
      id: crypto.randomUUID(),
      shiftId,
    };
    store = store.map(s =>
      s.id === shiftId ? { ...s, slots: [...(s.slots ?? []), slot] } : s
    );
    return slot;
  }

  async listSlots(shiftId: string): Promise<ScheduleSlot[]> {
    const shift = store.find(s => s.id === shiftId);
    return shift?.slots ?? [];
  }
}
