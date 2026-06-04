import { IHolidayService } from './holidayInterface';
import { Holiday, Recess, CreateHolidayDto, CreateRecessDto } from '../models/holidayModel';

export class HolidayService implements IHolidayService {
  async list(year?: number): Promise<Holiday[]> {
    const url = year ? `/api/holiday?year=${year}` : '/api/holiday';
    const res = await fetch(url);
    if (!res.ok) return [];
    return res.json();
  }

  async create(dto: CreateHolidayDto): Promise<Holiday> {
    const res = await fetch('/api/holiday', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    return res.json();
  }

  async delete(id: string): Promise<void> {
    await fetch(`/api/holiday/${id}`, { method: 'DELETE' });
  }

  async createRecess(dto: CreateRecessDto): Promise<Recess> {
    const res = await fetch('/api/holiday/recess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    return res.json();
  }

  async listRecesses(editionId: string): Promise<Recess[]> {
    const res = await fetch(`/api/holiday/recess/${editionId}`);
    if (!res.ok) return [];
    return res.json();
  }
}
