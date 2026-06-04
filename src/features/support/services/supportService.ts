import { ISupportService } from './supportInterface';
import { SupportTicket } from '../models/supportModel';

export class SupportService implements ISupportService {
  async getTickets(): Promise<SupportTicket[]> {
    const response = await fetch('/api/support');
    return response.json();
  }

  async createTicket(t: Omit<SupportTicket, 'id'>): Promise<SupportTicket> {
    const response = await fetch('/api/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(t),
    });
    return response.json();
  }

  async updateTicket(t: SupportTicket): Promise<SupportTicket> {
    const response = await fetch(`/api/support/${t.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(t),
    });
    return response.json();
  }
}
