import { IDayLessonService } from './dayLessonInterface';
import { DayLesson, DayLessonStudent } from '../models/dayLessonModel';

type BackendStudent = {
  studentId: string;
  isPresent?: boolean;
  observations?: string;
};

type BackendDayLesson = {
  id: string;
  startDate: string;
  endDate: string;
  canceledAt?: string;
  topics: string[];
  students: BackendStudent[];
};

function toFrontStudent(s: BackendStudent, idx: number): DayLessonStudent {
  return {
    studentId: idx + 1, // back-end uses Guid; positional index until model aligned
    studentName: '',    // not returned by GET /api/day-lesson; tracked in TODO
    matricula: '',      // not returned by back-end; tracked in TODO
    status: s.isPresent === true ? 'present' : 'absent',
  };
}

export class DayLessonService implements IDayLessonService {
  async getDayLesson(classId: number, date: string): Promise<DayLesson | null> {
    const res = await fetch(`/api/day-lesson/${classId}`);
    if (!res.ok) return null;
    const lessons: BackendDayLesson[] = await res.json();
    const lesson = lessons.find(l => l.startDate.startsWith(date));
    if (!lesson) return null;
    return {
      classId,
      date,
      contents: lesson.topics,
      students: lesson.students.map(toFrontStudent),
    };
  }

  async saveDayLesson(lesson: DayLesson): Promise<void> {
    const res = await fetch(`/api/day-lesson/${lesson.classId}`);
    if (!res.ok) return;
    const lessons: BackendDayLesson[] = await res.json();
    const backendLesson = lessons.find(l => l.startDate.startsWith(lesson.date));
    if (!backendLesson) return;

    await fetch(`/api/day-lesson/${backendLesson.id}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        students: lesson.students.map(s => ({
          studentId: String(s.studentId),
          isPresent: s.status !== 'absent',
          observation: s.status === 'late' ? 'Atraso' : null,
        })),
      }),
    });
  }
}
