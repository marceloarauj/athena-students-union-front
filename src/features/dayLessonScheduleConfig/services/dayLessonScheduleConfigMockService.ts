import { IDayLessonScheduleConfigService } from './dayLessonScheduleConfigInterface';
import {
  DayLessonScheduleConfig,
  CreateDayLessonScheduleConfig,
  UpdateDayLessonScheduleConfig,
  countDaysInWeek,
} from '../models/dayLessonScheduleConfigModel';
import rawData from '@/seeds/day_lesson_schedule_config_data.json';

export class DayLessonScheduleConfigMockService implements IDayLessonScheduleConfigService {
  private configs: DayLessonScheduleConfig[] = JSON.parse(JSON.stringify(rawData));

  async getConfigs(): Promise<DayLessonScheduleConfig[]> {
    return [...this.configs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async createConfig(config: CreateDayLessonScheduleConfig): Promise<DayLessonScheduleConfig> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newConfig: DayLessonScheduleConfig = {
      id: crypto.randomUUID(),
      ...config,
      timesPerWeek: countDaysInWeek(config.daysOfWeek),
      isActive: true,
      institutionId: 'inst-mock',
      createdAt: new Date().toISOString(),
    };
    this.configs.unshift(newConfig);
    return newConfig;
  }

  async updateConfig(id: string, config: UpdateDayLessonScheduleConfig): Promise<DayLessonScheduleConfig> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const idx = this.configs.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Config not found');
    const updated: DayLessonScheduleConfig = {
      ...this.configs[idx],
      ...config,
      timesPerWeek:
        config.daysOfWeek !== undefined
          ? countDaysInWeek(config.daysOfWeek)
          : this.configs[idx].timesPerWeek,
    };
    this.configs[idx] = updated;
    return updated;
  }
}
