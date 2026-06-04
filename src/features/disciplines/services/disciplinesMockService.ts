import { IDisciplinesService } from './disciplinesInterface';
import { Discipline } from '../models/disciplineModel';
import data from '@/seeds/disciplines_data.json';

export class DisciplinesMockService implements IDisciplinesService {
  private disciplines: Discipline[] = data as Discipline[];

  async getDisciplines(): Promise<Discipline[]> {
    return [...this.disciplines];
  }

  async createDiscipline(d: Omit<Discipline, 'id'>): Promise<Discipline> {
    const newD = { ...d, id: this.disciplines.length + 1 };
    this.disciplines.push(newD);
    return newD;
  }

  async updateDiscipline(d: Discipline): Promise<Discipline> {
    this.disciplines = this.disciplines.map(x => (x.id === d.id ? d : x));
    return d;
  }

  async deleteDiscipline(id: number): Promise<void> {
    this.disciplines = this.disciplines.filter(x => x.id !== id);
  }
}
