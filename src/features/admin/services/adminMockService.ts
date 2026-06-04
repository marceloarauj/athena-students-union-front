import type { IAdminService } from './adminInterface';
import type { AdminInstitution } from '../models/adminInstitutionModel';
import type { AdminUserRegister } from '../models/adminUserModel';
import data from '@/seeds/admin_institutions.json';

const MOCK_CREDENTIALS = { username: 'admin', password: 'admin123' };

export class AdminMockService implements IAdminService {
  private institutions: AdminInstitution[] = data as AdminInstitution[];

  async login(username: string, password: string): Promise<boolean> {
    return username === MOCK_CREDENTIALS.username && password === MOCK_CREDENTIALS.password;
  }

  async getInstitutions(): Promise<AdminInstitution[]> {
    return [...this.institutions];
  }

  async createInstitution(i: Omit<AdminInstitution, 'id' | 'createdAt'>): Promise<AdminInstitution> {
    const newInstitution: AdminInstitution = {
      ...i,
      id: this.institutions.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.institutions.push(newInstitution);
    return newInstitution;
  }

  async updateInstitution(i: AdminInstitution): Promise<AdminInstitution> {
    this.institutions = this.institutions.map(x => (x.id === i.id ? i : x));
    return i;
  }

  async deleteInstitution(id: number): Promise<void> {
    this.institutions = this.institutions.filter(x => x.id !== id);
  }

  async registerAdminUser(_institutionId: number, _data: AdminUserRegister): Promise<void> {
    // mock: resolves immediately simulating successful registration
  }
}
