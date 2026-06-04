export type GradeStatus = 'approved' | 'warning' | 'danger';

export type GradeReport = {
  subject: string;
  b1: number;
  b2: number;
  b3: number;
  b4: number;
  average: number;
  status: GradeStatus;
};
