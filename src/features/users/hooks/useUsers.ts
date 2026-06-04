'use client';

import { useEffect, useState } from 'react';
import { AppUser } from '../models/appUserModel';
import { getUsersService } from '../services/usersInterface';

export function useUsers(institution: string) {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const service = getUsersService(institution);

  useEffect(() => {
    service.getUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, [institution]);

  async function deleteUser(id: number) {
    await service.deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  }

  async function saveUser(user: AppUser | Omit<AppUser, 'id'>) {
    if ('id' in user) {
      const updated = await service.updateUser(user);
      setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
    } else {
      const created = await service.createUser(user);
      setUsers(prev => [...prev, created]);
    }
  }

  return { users, loading, deleteUser, saveUser };
}
