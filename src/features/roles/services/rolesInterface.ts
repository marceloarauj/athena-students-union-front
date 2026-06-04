import { RoleModel } from '../models/roleModel';
import { RolesMockService } from './rolesMockService';
import { RolesService } from './rolesService';
import { isMock } from '@/lib/serviceFactory';

export interface IRolesService {
  getRoles(): Promise<RoleModel[]>;
  createRole(role: Omit<RoleModel, 'id'>): Promise<RoleModel>;
  updateRole(role: RoleModel): Promise<RoleModel>;
  deleteRole(id: number): Promise<void>;
}

export function getRolesService(institution: string): IRolesService {
  return isMock(institution) ? new RolesMockService() : new RolesService();
}
