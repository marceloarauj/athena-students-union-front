export type GradeStatus = 'approved' | 'warning' | 'danger';

export type ChildGradeReport = {
  subject: string;
  b1: number;
  b2: number;
  b3: number;
  b4: number;
  average: number;
  status: GradeStatus;
};

export type ActivityType = 'homework' | 'test' | 'event' | 'notice';

export type ChildActivity = {
  id: number;
  title: string;
  description: string;
  date: string;
  type: ActivityType;
};

export type ChildScheduleEvent = {
  id: number;
  type: 'Holiday' | 'Event' | 'Classroom' | 'Optional';
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
};

export type ChildObservation = {
  id: number;
  author: string;
  date: string;
  text: string;
};

export type Child = {
  id: number;
  name: string;
  className: string;
  teacher: string;
  observations?: ChildObservation[];
  grades: ChildGradeReport[];
  activities: ChildActivity[];
  scheduleEvents: ChildScheduleEvent[];
};
