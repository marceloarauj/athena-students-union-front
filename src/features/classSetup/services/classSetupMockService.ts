import { IClassSetupService } from './classSetupInterface';
import { SchoolClass } from '../models/classSetupModel';
import data from '@/seeds/class_setup_data.json';

export class ClassSetupMockService implements IClassSetupService {
  private classes: SchoolClass[] = data as SchoolClass[];

  async getClasses(): Promise<SchoolClass[]> {
    return [...this.classes];
  }

  async createClass(c: Omit<SchoolClass, 'id'>): Promise<SchoolClass> {
    const newC = { ...c, id: this.classes.length + 1 };
    this.classes.push(newC);
    return newC;
  }

  async updateClass(c: SchoolClass): Promise<SchoolClass> {
    this.classes = this.classes.map(x => (x.id === c.id ? c : x));
    return c;
  }

  async deleteClass(id: number): Promise<void> {
    this.classes = this.classes.filter(x => x.id !== id);
  }
}
