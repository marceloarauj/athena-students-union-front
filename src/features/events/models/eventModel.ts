export type EventType = 'reuniao' | 'prova' | 'feriado' | 'palestra' | 'excursao' | 'outro';

export type CalendarEvent = {
  id: number;
  title: string;
  type: EventType;
  description: string;
  allDay: boolean;
  startDate: string;   // YYYY-MM-DD
  endDate: string;     // YYYY-MM-DD
  startTime?: string;  // HH:mm — only when !allDay
  endTime?: string;    // HH:mm — only when !allDay
};

export const EVENT_TYPE_CONFIG: Record<EventType, { label: string; color: string }> = {
  reuniao:  { label: 'Reunião',    color: '#3B82F6' },
  prova:    { label: 'Avaliação',  color: '#EF4444' },
  feriado:  { label: 'Feriado',    color: '#10B981' },
  palestra: { label: 'Palestra',   color: '#8B5CF6' },
  excursao: { label: 'Excursão',   color: '#F97316' },
  outro:    { label: 'Outro',      color: '#6B7280' },
};
