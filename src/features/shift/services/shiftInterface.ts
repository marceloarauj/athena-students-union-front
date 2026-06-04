import { Shift, ScheduleSlot, CreateShiftDto, AddScheduleSlotDto } from '../models/shiftModel';
import { ShiftMockService } from './shiftMockService';
import { ShiftService } from './shiftService';
import { isMock } from '@/lib/serviceFactory';

export interface IShiftService {
  list(): Promise<Shift[]>;
  create(dto: CreateShiftDto): Promise<Shift>;
  addSlot(shiftId: string, dto: AddScheduleSlotDto): Promise<ScheduleSlot>;
  listSlots(shiftId: string): Promise<ScheduleSlot[]>;
}

export function getShiftService(institution: string): IShiftService {
  return isMock(institution) ? new ShiftMockService() : new ShiftService();
}
