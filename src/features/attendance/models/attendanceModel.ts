export type AttendanceStatus = 'present' | 'absent' | 'late';

export type AttendanceClass = {
  id: number;
  discipline: string;
  time: string;
  date: string;
  turma: string;
};

export type AttendanceStudent = {
  id: number;
  name: string;
  matricula: string;
  status: AttendanceStatus;
};

export type AttendanceData = {
  classes: AttendanceClass[];
  students: AttendanceStudent[];
};
