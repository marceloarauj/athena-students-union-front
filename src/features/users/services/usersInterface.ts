import { AppUser } from '../models/appUserModel';
import { UsersMockService } from './usersMockService';
import { UsersService } from './usersService';
import { isMock } from '@/lib/serviceFactory';

export interface IUsersService {
  getUsers(): Promise<AppUser[]>;
  createUser(user: Omit<AppUser, 'id'>): Promise<AppUser>;
  updateUser(user: AppUser): Promise<AppUser>;
  deleteUser(id: number): Promise<void>;
}

export function getUsersService(institution: string): IUsersService {
  return isMock(institution) ? new UsersMockService() : new UsersService();
}
