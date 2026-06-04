import { Room, CreateRoomDto } from '../models/roomModel';
import { RoomMockService } from './roomMockService';
import { RoomService } from './roomService';
import { isMock } from '@/lib/serviceFactory';

export interface IRoomService {
  list(): Promise<Room[]>;
  create(dto: CreateRoomDto): Promise<Room>;
}

export function getRoomService(institution: string): IRoomService {
  return isMock(institution) ? new RoomMockService() : new RoomService();
}
