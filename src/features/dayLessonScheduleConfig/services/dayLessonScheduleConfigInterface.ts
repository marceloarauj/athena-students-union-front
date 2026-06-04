import {
  DayLessonScheduleConfig,
  CreateDayLessonScheduleConfig,
  UpdateDayLessonScheduleConfig,
} from '../models/dayLessonScheduleConfigModel';
import { DayLessonScheduleConfigMockService } from './dayLessonScheduleConfigMockService';
import { DayLessonScheduleConfigService } from './dayLessonScheduleConfigService';
import { isMock } from '@/lib/serviceFactory';

export interface IDayLessonScheduleConfigService {
  getConfigs(): Promise<DayLessonScheduleConfig[]>;
  createConfig(config: CreateDayLessonScheduleConfig): Promise<DayLessonScheduleConfig>;
  updateConfig(id: string, config: UpdateDayLessonScheduleConfig): Promise<DayLessonScheduleConfig>;
}

export function getDayLessonScheduleConfigService(institution: string): IDayLessonScheduleConfigService {
  return isMock(institution)
    ? new DayLessonScheduleConfigMockService()
    : new DayLessonScheduleConfigService();
}
