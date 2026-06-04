export type Room = {
  id: string;
  name: string;
  capacity: number;
  hasLab: boolean;
  isActive: boolean;
  createdAt: string;
};

export type CreateRoomDto = {
  name: string;
  capacity: number;
  hasLab: boolean;
};
