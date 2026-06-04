// WeekDays flags enum — mirrors WeekDays.cs in the back-end
export const WEEK_DAY_FLAGS = [
  { key: 'dom', label: 'Dom', value: 1 },   // Sunday   = 1 << 0
  { key: 'seg', label: 'Seg', value: 2 },   // Monday   = 1 << 1
  { key: 'ter', label: 'Ter', value: 4 },   // Tuesday  = 1 << 2
  { key: 'qua', label: 'Qua', value: 8 },   // Wednesday= 1 << 3
  { key: 'qui', label: 'Qui', value: 16 },  // Thursday = 1 << 4
  { key: 'sex', label: 'Sex', value: 32 },  // Friday   = 1 << 5
  { key: 'sab', label: 'Sáb', value: 64 },  // Saturday = 1 << 6
] as const;

export type DayLessonScheduleConfig = {
  id: string;
  startDate: string;       // YYYY-MM-DD
  endDate?: string;        // YYYY-MM-DD — exclusive with lessonCount
  lessonStartTime: string; // HH:mm
  lessonEndTime: string;   // HH:mm
  daysOfWeek: number;      // WeekDays bitmask
  timesPerWeek: number;    // derived: count of set bits in daysOfWeek
  lessonCount?: number;    // exclusive with endDate
  isActive: boolean;
  institutionId: string;
  disciplineId?: string;
  disciplineName?: string;
  createdAt: string;
};

export type CreateDayLessonScheduleConfig = {
  startDate: string;
  endDate?: string;
  lessonStartTime: string;
  lessonEndTime: string;
  daysOfWeek: number;
  lessonCount?: number;
  disciplineId?: string;
};

export type UpdateDayLessonScheduleConfig = {
  startDate?: string;
  endDate?: string;
  lessonStartTime?: string;
  lessonEndTime?: string;
  daysOfWeek?: number;
  lessonCount?: number;
  isActive?: boolean;
};

export function countDaysInWeek(daysOfWeek: number): number {
  let count = 0;
  let n = daysOfWeek;
  while (n > 0) {
    count += n & 1;
    n >>= 1;
  }
  return count;
}

export function getDayLabels(daysOfWeek: number): string[] {
  return WEEK_DAY_FLAGS.filter(d => (daysOfWeek & d.value) !== 0).map(d => d.label);
}
