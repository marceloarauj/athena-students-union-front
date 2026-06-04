export type ScheduleEventType = 'Holiday' | 'Event' | 'Classroom' | 'Optional';

export type ScheduleEvent = {
  id: number;
  type: ScheduleEventType;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
};
