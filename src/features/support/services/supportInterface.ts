import { SupportTicket } from '../models/supportModel';
import { SupportMockService } from './supportMockService';
import { SupportService } from './supportService';
import { isMock } from '@/lib/serviceFactory';

export interface ISupportService {
  getTickets(): Promise<SupportTicket[]>;
  createTicket(t: Omit<SupportTicket, 'id'>): Promise<SupportTicket>;
  updateTicket(t: SupportTicket): Promise<SupportTicket>;
}

export function getSupportService(institution: string): ISupportService {
  return isMock(institution) ? new SupportMockService() : new SupportService();
}
