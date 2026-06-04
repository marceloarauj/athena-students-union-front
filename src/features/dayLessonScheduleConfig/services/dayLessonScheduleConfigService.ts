import { IDayLessonScheduleConfigService } from './dayLessonScheduleConfigInterface';
import {
  DayLessonScheduleConfig,
  CreateDayLessonScheduleConfig,
  UpdateDayLessonScheduleConfig,
} from '../models/dayLessonScheduleConfigModel';

type BackendConfig = {
  id: string;
  startDate: string;
  endDate?: string;
  lessonStartTime: string; // "HH:mm:ss" from TimeOnly serialization
  lessonEndTime: string;
  daysOfWeek: number;
  timesPerWeek: number;
  lessonCount?: number;
  isActive: boolean;
  institutionId: string;
  disciplineId?: string;
  disciplineName?: string;
  createdAt: string;
};

function fromBackend(c: BackendConfig): DayLessonScheduleConfig {
  return {
    ...c,
    startDate: c.startDate.split('T')[0],
    endDate: c.endDate ? c.endDate.split('T')[0] : undefined,
    lessonStartTime: c.lessonStartTime.substring(0, 5),
    lessonEndTime: c.lessonEndTime.substring(0, 5),
  };
}

const BASE = '/api/DayLessonScheduleConfig';

export class DayLessonScheduleConfigService implements IDayLessonScheduleConfigService {
  async getConfigs(): Promise<DayLessonScheduleConfig[]> {
    const res = await fetch(BASE);
    if (!res.ok) return [];
    const data: BackendConfig[] = await res.json();
    return data.map(fromBackend);
  }

  async createConfig(config: CreateDayLessonScheduleConfig): Promise<DayLessonScheduleConfig> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate: config.startDate,
        endDate: config.endDate ?? null,
        lessonStartTime: `${config.lessonStartTime}:00`,
        lessonEndTime: `${config.lessonEndTime}:00`,
        daysOfWeek: config.daysOfWeek,
        lessonCount: config.lessonCount ?? null,
        disciplineId: config.disciplineId ?? null,
      }),
    });
    const data: BackendConfig = await res.json();
    return fromBackend(data);
  }

  async updateConfig(id: string, config: UpdateDayLessonScheduleConfig): Promise<DayLessonScheduleConfig> {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...config,
        lessonStartTime: config.lessonStartTime ? `${config.lessonStartTime}:00` : undefined,
        lessonEndTime: config.lessonEndTime ? `${config.lessonEndTime}:00` : undefined,
      }),
    });
    const data: BackendConfig = await res.json();
    return fromBackend(data);
  }
}
