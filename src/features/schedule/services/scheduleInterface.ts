import { ScheduleEvent } from '../models/scheduleModel';
import { ScheduleMockService } from './scheduleMockService';
import { ScheduleService } from './scheduleService';
import { isMock } from '@/lib/serviceFactory';

export interface IScheduleService {
  getEvents(): Promise<ScheduleEvent[]>;
}

export function getScheduleService(institution: string): IScheduleService {
  return isMock(institution) ? new ScheduleMockService() : new ScheduleService();
}
