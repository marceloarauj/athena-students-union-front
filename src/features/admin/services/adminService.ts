import type { IAdminService } from './adminInterface';
import type { AdminInstitution } from '../models/adminInstitutionModel';
import type { AdminUserRegister } from '../models/adminUserModel';

export class AdminService implements IAdminService {
  async login(username: string, password: string): Promise<boolean> {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return response.ok;
  }

  async getInstitutions(): Promise<AdminInstitution[]> {
    const response = await fetch('/api/admin/institutions');
    return response.json();
  }

  async createInstitution(i: Omit<AdminInstitution, 'id' | 'createdAt'>): Promise<AdminInstitution> {
    const response = await fetch('/api/admin/institutions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(i),
    });
    return response.json();
  }

  async updateInstitution(i: AdminInstitution): Promise<AdminInstitution> {
    const response = await fetch(`/api/admin/institutions/${i.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(i),
    });
    return response.json();
  }

  async deleteInstitution(id: number): Promise<void> {
    await fetch(`/api/admin/institutions/${id}`, { method: 'DELETE' });
  }

  async registerAdminUser(institutionId: number, data: AdminUserRegister): Promise<void> {
    await fetch('/api/register/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, institutionId }),
    });
  }
}
