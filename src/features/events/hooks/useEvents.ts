'use client';

import { useEffect, useState } from 'react';
import type { CalendarEvent } from '../models/eventModel';
import { getEventsService } from '../services/eventsInterface';
import { toast } from 'sonner';

export function useEvents(institution: string) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventsService(institution).getEvents().then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, [institution]);

  async function saveEvent(e: Omit<CalendarEvent, 'id'> | CalendarEvent) {
    const service = getEventsService(institution);
    if ('id' in e) {
      const updated = await service.updateEvent(e);
      setEvents(prev => prev.map(x => (x.id === updated.id ? updated : x)));
      toast.success('Evento atualizado.');
    } else {
      const created = await service.createEvent(e);
      setEvents(prev => [...prev, created]);
      toast.success('Evento cadastrado.');
    }
  }

  async function deleteEvent(id: number) {
    await getEventsService(institution).deleteEvent(id);
    setEvents(prev => prev.filter(x => x.id !== id));
    toast.success('Evento removido.');
  }

  return { events, loading, saveEvent, deleteEvent };
}
