export type AttendanceStatus = 'present' | 'absent' | 'late';

export type DayLessonStudent = {
  studentId: number;
  studentName: string;
  matricula: string;
  status: AttendanceStatus;
};

export type DayLesson = {
  classId: number;
  date: string;
  contents: string[];
  students: DayLessonStudent[];
};
