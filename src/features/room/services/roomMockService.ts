import { IRoomService } from './roomInterface';
import { Room, CreateRoomDto } from '../models/roomModel';
import data from '@/seeds/rooms_data.json';

let store: Room[] = data as Room[];

export class RoomMockService implements IRoomService {
  async list(): Promise<Room[]> {
    return store;
  }

  async create(dto: CreateRoomDto): Promise<Room> {
    const room: Room = {
      ...dto,
      id: crypto.randomUUID(),
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    store = [...store, room];
    return room;
  }
}
