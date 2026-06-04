import { DayLesson } from '../models/dayLessonModel';
import { DayLessonMockService } from './dayLessonMockService';
import { DayLessonService } from './dayLessonService';
import { isMock } from '@/lib/serviceFactory';

export interface IDayLessonService {
  getDayLesson(classId: number, date: string): Promise<DayLesson | null>;
  saveDayLesson(lesson: DayLesson): Promise<void>;
}

export function getDayLessonService(institution: string): IDayLessonService {
  return isMock(institution) ? new DayLessonMockService() : new DayLessonService();
}
