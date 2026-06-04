export type SubjectGrade = {
  id: number;
  name: string;
  b1: number | null;
  b2: number | null;
  b3: number | null;
  b4: number | null;
};

export type StudentGrades = {
  id: number;
  name: string;
  matricula: string;
  turma: string;
  subjects: SubjectGrade[];
};

export type ClassStudentGrade = {
  studentId: number;
  studentName: string;
  matricula: string;
  b1: number | null;
  b2: number | null;
  b3: number | null;
  b4: number | null;
};

export type ClassGrades = {
  classId: number;
  students: ClassStudentGrade[];
};
