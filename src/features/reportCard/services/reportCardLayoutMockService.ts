import type { IReportCardLayoutService } from './reportCardLayoutInterface';
import type { ReportCardLayoutConfig } from '../models/reportCardLayoutModel';
import seedData from '@/seeds/report_card_layout.json';

const STORAGE_KEY = 'athena_report_card_layout';

export class ReportCardLayoutMockService implements IReportCardLayoutService {
  async getLayout(): Promise<ReportCardLayoutConfig> {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as ReportCardLayoutConfig;
      }
    }
    return seedData as ReportCardLayoutConfig;
  }

  async saveLayout(config: ReportCardLayoutConfig): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
  }
}
