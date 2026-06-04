export type ClassFrequency = 'diaria' | '2x' | '3x' | '4x' | '5x';

export type SchoolClass = {
  id: number;
  name: string;
  discipline: string;
  teacher: string;
  startDate: string;
  endDate: string;
  frequency: ClassFrequency;
  daysOfWeek: string[];
  totalClasses: number;
};
