import type { IEventsService } from './eventsInterface';
import type { CalendarEvent } from '../models/eventModel';

type BackendEvent = {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
};

function toFrontEvent(e: BackendEvent, id: number): CalendarEvent {
  return {
    id,
    title: e.name,
    type: 'outro',   // back-end has no event type; tracked in TODO
    description: e.description ?? '',
    allDay: true,    // back-end stores no time; tracked in TODO
    startDate: e.startDate.split('T')[0],
    endDate: e.endDate.split('T')[0],
  };
}

function buildDateTime(date: string, time?: string): string {
  return time ? `${date}T${time}:00` : `${date}T00:00:00`;
}

export class EventsService implements IEventsService {
  async getEvents(): Promise<CalendarEvent[]> {
    const response = await fetch('/api/event');
    if (!response.ok) return [];
    const data: BackendEvent[] = await response.json();
    return data.map((e, idx) => toFrontEvent(e, idx + 1));
  }

  async createEvent(e: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    const response = await fetch('/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: e.title,
        description: e.description || null,
        startDate: buildDateTime(e.startDate, e.startTime),
        endDate: buildDateTime(e.endDate, e.endTime ?? e.startTime),
      }),
    });
    const data: BackendEvent = await response.json();
    return toFrontEvent(data, Date.now());
  }

  async updateEvent(e: CalendarEvent): Promise<CalendarEvent> {
    // PUT /api/event/{id} not yet implemented in back-end; tracked in TODO
    const response = await fetch(`/api/event/${e.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: e.title,
        description: e.description || null,
        startDate: buildDateTime(e.startDate, e.startTime),
        endDate: buildDateTime(e.endDate, e.endTime ?? e.startTime),
      }),
    });
    const data: BackendEvent = await response.json();
    return toFrontEvent(data, e.id);
  }

  async deleteEvent(id: number): Promise<void> {
    // DELETE /api/event/{id} not yet implemented in back-end; tracked in TODO
    await fetch(`/api/event/${id}`, { method: 'DELETE' });
  }
}
