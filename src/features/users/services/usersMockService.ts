import { IUsersService } from './usersInterface';
import { AppUser } from '../models/appUserModel';
import data from '@/seeds/users_data.json';

export class UsersMockService implements IUsersService {
  private users: AppUser[] = data as AppUser[];

  async getUsers(): Promise<AppUser[]> {
    return [...this.users];
  }

  async createUser(user: Omit<AppUser, 'id'>): Promise<AppUser> {
    const newUser = { ...user, id: this.users.length + 1 };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(user: AppUser): Promise<AppUser> {
    this.users = this.users.map(u => (u.id === user.id ? user : u));
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    this.users = this.users.filter(u => u.id !== id);
  }
}
