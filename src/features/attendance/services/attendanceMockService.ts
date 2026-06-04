import { IAttendanceService } from './attendanceInterface';
import { AttendanceData } from '../models/attendanceModel';
import data from '@/seeds/attendance_data.json';

export class AttendanceMockService implements IAttendanceService {
  async getAttendanceData(): Promise<AttendanceData> {
    return data as AttendanceData;
  }
}
