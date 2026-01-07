import { AcademicPerformance } from './academicPerformanceModel';
import { DisciplineModel } from './tableDisciplineModel';

export interface ProfileResponseModel {
  FullName: string;
  Role: string;
  Email: string;
  Registration: string;
  BirthDate: string;
  Phone: string;
  Grade: string;
  Shift: string;
  Guardian: string;
  GuardianContact: string;
  disciplines: DisciplineModel[];
  AcademicPerformance: AcademicPerformance[];
}
