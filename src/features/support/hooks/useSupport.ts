'use client';

import { useEffect, useState } from 'react';
import { SupportTicket, TicketStatus } from '../models/supportModel';
import { getSupportService } from '../services/supportInterface';
import { toast } from 'sonner';

export function useSupport(institution: string) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const service = getSupportService(institution);

  useEffect(() => {
    service.getTickets().then(data => {
      setTickets(data);
      setLoading(false);
    });
  }, [institution]);

  async function createTicket(t: Omit<SupportTicket, 'id'>) {
    const created = await service.createTicket(t);
    setTickets(prev => [created, ...prev]);
    toast.success('Chamado aberto com sucesso!');
  }

  async function updateStatus(id: string, status: TicketStatus) {
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) return;
    const updated = await service.updateTicket({ ...ticket, status });
    setTickets(prev => prev.map(t => (t.id === id ? updated : t)));
    toast.success('Status atualizado.');
  }

  return { tickets, loading, createTicket, updateStatus };
}
