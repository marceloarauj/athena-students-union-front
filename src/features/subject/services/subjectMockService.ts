import { ISubjectService } from './subjectInterface';
import { Subject, CreateSubjectDto } from '../models/subjectModel';
import data from '@/seeds/subjects_data.json';

let store: Subject[] = data as Subject[];

export class SubjectMockService implements ISubjectService {
  async listByProgram(programId: string): Promise<Subject[]> {
    return store.filter(s => s.programId === programId);
  }

  async create(dto: CreateSubjectDto): Promise<Subject> {
    const subject: Subject = { ...dto, id: crypto.randomUUID(), isActive: true };
    store = [...store, subject];
    return subject;
  }
}
