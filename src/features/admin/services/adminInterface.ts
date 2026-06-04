import type { AdminInstitution } from '../models/adminInstitutionModel';
import type { AdminUserRegister } from '../models/adminUserModel';
import { AdminMockService } from './adminMockService';
import { AdminService } from './adminService';

export interface IAdminService {
  getInstitutions(): Promise<AdminInstitution[]>;
  createInstitution(i: Omit<AdminInstitution, 'id' | 'createdAt'>): Promise<AdminInstitution>;
  updateInstitution(i: AdminInstitution): Promise<AdminInstitution>;
  deleteInstitution(id: number): Promise<void>;
  login(username: string, password: string): Promise<boolean>;
  registerAdminUser(institutionId: number, data: AdminUserRegister): Promise<void>;
}

const USE_MOCK = false;

export function getAdminService(): IAdminService {
  return USE_MOCK ? new AdminMockService() : new AdminService();
}
