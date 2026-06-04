'use client';

import { useEffect, useState } from 'react';
import { Room, CreateRoomDto } from '../models/roomModel';
import { getRoomService } from '../services/roomInterface';
import { toast } from 'sonner';

export function useRoom(institution: string) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const service = getRoomService(institution);

  useEffect(() => {
    service.list().then(data => {
      setRooms(data);
      setLoading(false);
    });
  }, [institution]);

  async function createRoom(dto: CreateRoomDto) {
    const created = await service.create(dto);
    setRooms(prev => [...prev, created]);
    toast.success('Sala criada.');
    return created;
  }

  return { rooms, loading, createRoom };
}
