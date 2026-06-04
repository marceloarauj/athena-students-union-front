import { IRolesService } from './rolesInterface';
import { RoleModel } from '../models/roleModel';

export class RolesService implements IRolesService {
  async getRoles(): Promise<RoleModel[]> {
    const response = await fetch('/api/roles');
    return response.json();
  }

  async createRole(role: Omit<RoleModel, 'id'>): Promise<RoleModel> {
    const response = await fetch('/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(role),
    });
    return response.json();
  }

  async updateRole(role: RoleModel): Promise<RoleModel> {
    const response = await fetch(`/api/roles/${role.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(role),
    });
    return response.json();
  }

  async deleteRole(id: number): Promise<void> {
    await fetch(`/api/roles/${id}`, { method: 'DELETE' });
  }
}
