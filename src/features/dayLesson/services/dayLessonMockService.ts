import { IDayLessonService } from './dayLessonInterface';
import { DayLesson } from '../models/dayLessonModel';
import rawData from '@/seeds/day_lesson_data.json';

export class DayLessonMockService implements IDayLessonService {
  private data: DayLesson[] = JSON.parse(JSON.stringify(rawData)) as DayLesson[];

  async getDayLesson(classId: number, date: string): Promise<DayLesson | null> {
    return this.data.find(d => d.classId === classId && d.date === date) ?? null;
  }

  async saveDayLesson(lesson: DayLesson): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const idx = this.data.findIndex(d => d.classId === lesson.classId && d.date === lesson.date);
    if (idx >= 0) {
      this.data[idx] = lesson;
    } else {
      this.data.push(lesson);
    }
  }
}
