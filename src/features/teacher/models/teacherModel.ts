export type TeacherAvailability = {
  id: string;
  teacherId: string;
  dayOfWeek: number; // 0=Sunday ... 6=Saturday
  shiftId: string;
};

export type Teacher = {
  id: string;
  userId: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  subjects?: string[];
  availability?: TeacherAvailability[];
};

export type CreateTeacherDto = {
  userId: string;
  name: string;
  email: string;
};

export type SetTeacherSubjectsDto = {
  subjectIds: string[];
};

export type SetTeacherAvailabilityDto = {
  availabilities: { dayOfWeek: number; shiftId: string }[];
};

export const DAY_OF_WEEK_LABELS: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado',
};
