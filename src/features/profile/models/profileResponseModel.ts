export interface Grade {
  key: string;
  value: number;
}

export interface Discipline {
  name: string;
  grades: Grade[];
}

export interface ProfileResponseModel {
  FullName: string;
  Email: string;
  Phone: string;
  Grade: string;
  Shift: string;
  Guardian: string;
  GuardianContact: string;
  disciplines: Discipline[];
  AcademicPerformance: unknown[];
}
