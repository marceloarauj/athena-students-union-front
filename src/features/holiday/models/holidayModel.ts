export type HolidayType = 1 | 2 | 3; // National | State | Municipal

export const HOLIDAY_TYPE_LABELS: Record<HolidayType, string> = {
  1: 'Nacional',
  2: 'Estadual',
  3: 'Municipal',
};

export type Holiday = {
  id: string;
  name: string;
  date: string;
  type: HolidayType;
  isRecurring: boolean;
};

export type Recess = {
  id: string;
  programEditionId: string;
  name: string;
  startDate: string;
  endDate: string;
};

export type CreateHolidayDto = {
  name: string;
  date: string;
  type: HolidayType;
  isRecurring: boolean;
};

export type CreateRecessDto = {
  programEditionId: string;
  name: string;
  startDate: string;
  endDate: string;
};
