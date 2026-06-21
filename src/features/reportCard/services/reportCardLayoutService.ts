import type { IReportCardLayoutService } from './reportCardLayoutInterface';
import type { ReportCardLayoutConfig } from '../models/reportCardLayoutModel';

export class ReportCardLayoutService implements IReportCardLayoutService {
  async getLayout(): Promise<ReportCardLayoutConfig> {
    const response = await fetch('/api/institution/report-card/layout');
    return response.json();
  }

  async saveLayout(config: ReportCardLayoutConfig): Promise<void> {
    await fetch('/api/institution/report-card/layout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
  }
}
