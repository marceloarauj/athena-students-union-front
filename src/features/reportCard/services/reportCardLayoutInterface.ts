import type { ReportCardLayoutConfig } from '../models/reportCardLayoutModel';
import { ReportCardLayoutMockService } from './reportCardLayoutMockService';
import { ReportCardLayoutService } from './reportCardLayoutService';
import { isMock } from '@/lib/serviceFactory';

export interface IReportCardLayoutService {
  getLayout(): Promise<ReportCardLayoutConfig>;
  saveLayout(config: ReportCardLayoutConfig): Promise<void>;
}

export function getReportCardLayoutService(institution: string): IReportCardLayoutService {
  return isMock(institution) ? new ReportCardLayoutMockService() : new ReportCardLayoutService();
}
