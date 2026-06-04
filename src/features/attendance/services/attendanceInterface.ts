import { AttendanceData } from '../models/attendanceModel';
import { AttendanceMockService } from './attendanceMockService';
import { AttendanceService } from './attendanceService';
import { isMock } from '@/lib/serviceFactory';

export interface IAttendanceService {
  getAttendanceData(): Promise<AttendanceData>;
}

export function getAttendanceService(institution: string): IAttendanceService {
  return isMock(institution) ? new AttendanceMockService() : new AttendanceService();
}
