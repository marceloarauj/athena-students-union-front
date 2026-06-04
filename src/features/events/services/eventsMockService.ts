import type { IEventsService } from './eventsInterface';
import type { CalendarEvent } from '../models/eventModel';
import data from '@/seeds/events_data.json';

export class EventsMockService implements IEventsService {
  private events: CalendarEvent[] = data as CalendarEvent[];

  async getEvents(): Promise<CalendarEvent[]> {
    return [...this.events];
  }

  async createEvent(e: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    const newEvent: CalendarEvent = { ...e, id: this.events.length + 1 };
    this.events.push(newEvent);
    return newEvent;
  }

  async updateEvent(e: CalendarEvent): Promise<CalendarEvent> {
    this.events = this.events.map(x => (x.id === e.id ? e : x));
    return e;
  }

  async deleteEvent(id: number): Promise<void> {
    this.events = this.events.filter(x => x.id !== id);
  }
}
