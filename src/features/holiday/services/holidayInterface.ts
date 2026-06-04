import { Holiday, Recess, CreateHolidayDto, CreateRecessDto } from '../models/holidayModel';
import { HolidayMockService } from './holidayMockService';
import { HolidayService } from './holidayService';
import { isMock } from '@/lib/serviceFactory';

export interface IHolidayService {
  list(year?: number): Promise<Holiday[]>;
  create(dto: CreateHolidayDto): Promise<Holiday>;
  delete(id: string): Promise<void>;
  createRecess(dto: CreateRecessDto): Promise<Recess>;
  listRecesses(editionId: string): Promise<Recess[]>;
}

export function getHolidayService(institution: string): IHolidayService {
  return isMock(institution) ? new HolidayMockService() : new HolidayService();
}
