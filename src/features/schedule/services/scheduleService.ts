import { IScheduleService } from './scheduleInterface';
import { ScheduleEvent } from '../models/scheduleModel';

export class ScheduleService implements IScheduleService {
  async getEvents(): Promise<ScheduleEvent[]> {
    const response = await fetch('/api/schedule');
    return response.json();
  }
}
