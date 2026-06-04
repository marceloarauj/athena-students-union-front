import { IRoomService } from './roomInterface';
import { Room, CreateRoomDto } from '../models/roomModel';

export class RoomService implements IRoomService {
  async list(): Promise<Room[]> {
    const res = await fetch('/api/room');
    if (!res.ok) return [];
    return res.json();
  }

  async create(dto: CreateRoomDto): Promise<Room> {
    const res = await fetch('/api/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    return res.json();
  }
}
