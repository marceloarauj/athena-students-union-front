import type { CalendarEvent } from '../models/eventModel';
import { EventsMockService } from './eventsMockService';
import { EventsService } from './eventsService';
import { isMock } from '@/lib/serviceFactory';

export interface IEventsService {
  getEvents(): Promise<CalendarEvent[]>;
  createEvent(e: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent>;
  updateEvent(e: CalendarEvent): Promise<CalendarEvent>;
  deleteEvent(id: number): Promise<void>;
}

export function getEventsService(institution: string): IEventsService {
  return isMock(institution) ? new EventsMockService() : new EventsService();
}
