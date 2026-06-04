import { IUsersService } from './usersInterface';
import { AppUser } from '../models/appUserModel';

export class UsersService implements IUsersService {
  async getUsers(): Promise<AppUser[]> {
    const response = await fetch('/api/users');
    return response.json();
  }

  async createUser(user: Omit<AppUser, 'id'>): Promise<AppUser> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return response.json();
  }

  async updateUser(user: AppUser): Promise<AppUser> {
    const response = await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return response.json();
  }

  async deleteUser(id: number): Promise<void> {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
  }
}
