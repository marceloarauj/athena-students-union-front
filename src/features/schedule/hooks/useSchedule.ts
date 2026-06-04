'use client';

import { useEffect, useState } from 'react';
import { ScheduleEvent } from '../models/scheduleModel';
import { getScheduleService } from '../services/scheduleInterface';

export function useSchedule(institution: string) {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const service = getScheduleService(institution);
    service.getEvents().then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, [institution]);

  return { events, loading };
}
