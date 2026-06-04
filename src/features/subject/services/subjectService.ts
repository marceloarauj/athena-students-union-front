import { ISubjectService } from './subjectInterface';
import { Subject, CreateSubjectDto } from '../models/subjectModel';

export class SubjectService implements ISubjectService {
  async listByProgram(programId: string): Promise<Subject[]> {
    const res = await fetch(`/api/subject/${programId}`);
    if (!res.ok) return [];
    return res.json();
  }

  async create(dto: CreateSubjectDto): Promise<Subject> {
    const res = await fetch('/api/subject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    return res.json();
  }
}
