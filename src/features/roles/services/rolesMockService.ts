import { IRolesService } from './rolesInterface';
import { RoleModel } from '../models/roleModel';
import data from '@/seeds/roles_data.json';

export class RolesMockService implements IRolesService {
  private roles: RoleModel[] = JSON.parse(JSON.stringify(data)) as RoleModel[];

  async getRoles(): Promise<RoleModel[]> {
    return [...this.roles];
  }

  async createRole(role: Omit<RoleModel, 'id'>): Promise<RoleModel> {
    const newRole = { ...role, id: Math.max(0, ...this.roles.map(r => r.id)) + 1 };
    this.roles.push(newRole);
    return newRole;
  }

  async updateRole(role: RoleModel): Promise<RoleModel> {
    this.roles = this.roles.map(r => (r.id === role.id ? role : r));
    return role;
  }

  async deleteRole(id: number): Promise<void> {
    this.roles = this.roles.filter(r => r.id !== id);
  }
}
