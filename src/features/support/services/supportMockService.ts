import { ISupportService } from './supportInterface';
import { SupportTicket } from '../models/supportModel';
import data from '@/seeds/support_data.json';

export class SupportMockService implements ISupportService {
  private tickets: SupportTicket[] = data as SupportTicket[];

  async getTickets(): Promise<SupportTicket[]> {
    return [...this.tickets];
  }

  async createTicket(t: Omit<SupportTicket, 'id'>): Promise<SupportTicket> {
    const newT = { ...t, id: `TKT-${String(this.tickets.length + 1).padStart(3, '0')}` };
    this.tickets.push(newT);
    return newT;
  }

  async updateTicket(t: SupportTicket): Promise<SupportTicket> {
    this.tickets = this.tickets.map(x => (x.id === t.id ? t : x));
    return t;
  }
}
