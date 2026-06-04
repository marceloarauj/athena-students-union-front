import { IHolidayService } from './holidayInterface';
import { Holiday, Recess, CreateHolidayDto, CreateRecessDto } from '../models/holidayModel';
import rawData from '@/seeds/holidays_data.json';

let holidays: Holiday[] = rawData.holidays as Holiday[];
let recesses: Recess[] = rawData.recesses as Recess[];

export class HolidayMockService implements IHolidayService {
  async list(year?: number): Promise<Holiday[]> {
    if (!year) return holidays;
    return holidays.filter(h => h.date.startsWith(String(year)));
  }

  async create(dto: CreateHolidayDto): Promise<Holiday> {
    const holiday: Holiday = { ...dto, id: crypto.randomUUID() };
    holidays = [...holidays, holiday];
    return holiday;
  }

  async delete(id: string): Promise<void> {
    holidays = holidays.filter(h => h.id !== id);
  }

  async createRecess(dto: CreateRecessDto): Promise<Recess> {
    const recess: Recess = { ...dto, id: crypto.randomUUID() };
    recesses = [...recesses, recess];
    return recess;
  }

  async listRecesses(editionId: string): Promise<Recess[]> {
    return recesses.filter(r => r.programEditionId === editionId);
  }
}
