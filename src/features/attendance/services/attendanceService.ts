import { IAttendanceService } from './attendanceInterface';
import { AttendanceData } from '../models/attendanceModel';

export class AttendanceService implements IAttendanceService {
  async getAttendanceData(): Promise<AttendanceData> {
    const response = await fetch('/api/attendance');
    return response.json();
  }
}
