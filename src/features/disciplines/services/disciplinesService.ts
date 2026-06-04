import { IDisciplinesService } from './disciplinesInterface';
import { Discipline } from '../models/disciplineModel';

type BackendDiscipline = {
  id: string;
  name: string;
  studyHours: number;
  credits: number;
  chargePayment: boolean;
  available: boolean;
  institutionId: string;
  topics: { id: string; content: string; lessonNumber: number }[];
};

function toFrontDiscipline(d: BackendDiscipline, id: number): Discipline {
  return {
    id,
    name: d.name,
    code: '',         // not in back-end; tracked in TODO
    description: '',  // not in back-end; tracked in TODO
    teacherCount: 0,  // not in back-end; tracked in TODO
    classes: 0,       // not in back-end; tracked in TODO
    color: '#6B7280', // not in back-end; tracked in TODO
    topics: d.topics.map((t, i) => ({ id: i + 1, title: t.content })),
  };
}

export class DisciplinesService implements IDisciplinesService {
  async getDisciplines(): Promise<Discipline[]> {
    // GET /api/discipline not yet implemented in back-end; tracked in TODO
    const response = await fetch('/api/discipline');
    if (!response.ok) return [];
    const data: BackendDiscipline[] = await response.json();
    return data.map((d, idx) => toFrontDiscipline(d, idx + 1));
  }

  async createDiscipline(d: Omit<Discipline, 'id'>): Promise<Discipline> {
    const response = await fetch('/api/discipline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: d.name,
        studyHours: 0,        // not in front model; tracked in TODO
        credits: 0,           // not in front model; tracked in TODO
        chargePayment: false, // not in front model; tracked in TODO
        topics: d.topics.map((t, i) => ({ content: t.title, lessonNumber: i + 1 })),
      }),
    });
    const data: BackendDiscipline = await response.json();
    return toFrontDiscipline(data, Date.now());
  }

  async updateDiscipline(d: Discipline): Promise<Discipline> {
    const response = await fetch(`/api/discipline/${d.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: d.name,
      }),
    });
    const data: BackendDiscipline = await response.json();
    return toFrontDiscipline(data, d.id);
  }

  async deleteDiscipline(id: number): Promise<void> {
    // DELETE /api/discipline/{id} not yet implemented in back-end; tracked in TODO
    await fetch(`/api/discipline/${id}`, { method: 'DELETE' });
  }
}
