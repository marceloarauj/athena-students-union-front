import { IScheduleService } from './scheduleInterface';
import { ScheduleEvent } from '../models/scheduleModel';
import data from '@/seeds/schedule_data.json';

export class ScheduleMockService implements IScheduleService {
  async getEvents(): Promise<ScheduleEvent[]> {
    return data as ScheduleEvent[];
  }
}
