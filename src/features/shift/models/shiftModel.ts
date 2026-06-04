export type ScheduleSlot = {
  id: string;
  shiftId: string;
  order: number;
  startTime: string;
  endTime: string;
};

export type Shift = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  slots?: ScheduleSlot[];
};

export type CreateShiftDto = {
  name: string;
  startTime: string;
  endTime: string;
};

export type AddScheduleSlotDto = {
  order: number;
  startTime: string;
  endTime: string;
};
