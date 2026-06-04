export type TicketStatus = 'open' | 'in_progress' | 'resolved';
export type TicketPriority = 'critical' | 'high' | 'medium' | 'low';

export type SupportTicket = {
  id: string;
  title: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  created: string;
  author: string;
  description: string;
};
