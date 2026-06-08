'use client';

import { useState } from 'react';
import { useInstitutionStore } from '@/entities/institution';
import { useSupport } from '@/features/support/hooks/useSupport';
import { usePermission } from '@/features/auth/hooks/usePermission';
import { usePermissionGuard } from '@/features/auth/hooks/usePermissionGuard';
import { SupportTicket, TicketPriority, TicketStatus } from '@/features/support/models/supportModel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const statusConfig: Record<TicketStatus, { label: string; variant: 'muted' | 'warning' | 'success'; icon: React.ReactNode }> = {
  open: { label: 'Aberto', variant: 'muted', icon: <Clock size={12} /> },
  in_progress: { label: 'Em andamento', variant: 'warning', icon: <Loader size={12} /> },
  resolved: { label: 'Resolvido', variant: 'success', icon: <CheckCircle size={12} /> },
};

const priorityConfig: Record<TicketPriority, { label: string; variant: 'danger' | 'warning' | 'info' | 'muted' }> = {
  critical: { label: 'Crítico', variant: 'danger' },
  high: { label: 'Alto', variant: 'warning' },
  medium: { label: 'Médio', variant: 'info' },
  low: { label: 'Baixo', variant: 'muted' },
};

export default function SupportPage() {
  const allowed = usePermissionGuard('SHOW_SCREEN_SUPPORT');
  const { institution } = useInstitutionStore();
  const { tickets, loading } = useSupport(institution?.alias ?? '');
  const { hasPermission } = usePermission();
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  if (!allowed) return null;

  const filtered = tickets.filter(t => {
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.author.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className='p-6 max-w-4xl mx-auto space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Suporte</h1>
          <p className='text-sm text-muted-foreground mt-1'>Gerencie chamados e solicitações.</p>
        </div>
        {hasPermission('OPEN_SUPPORT_TICKET') && (
          <button className='px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors'>
            + Novo Chamado
          </button>
        )}
      </div>

      {/* Filters */}
      <div className='flex flex-col sm:flex-row gap-3'>
        <input
          type='text'
          placeholder='Buscar chamado...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='flex-1 h-9 px-3 text-sm border border-border bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
        />
        <div className='flex gap-2'>
          {(['all', 'open', 'in_progress', 'resolved'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === s
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {s === 'all' ? 'Todos' : statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className='space-y-3'>
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className='h-24 w-full rounded-xl' />)}
        </div>
      ) : (
        <div className='space-y-3'>
          {filtered.map((ticket: SupportTicket) => {
            const status = statusConfig[ticket.status];
            const priority = priorityConfig[ticket.priority];
            return (
              <Card key={ticket.id} className='hover:border-primary/30 transition-colors cursor-pointer'>
                <CardContent className='p-4'>
                  <div className='flex items-start justify-between gap-3'>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 flex-wrap mb-1'>
                        <span className='text-xs font-mono text-muted-foreground'>{ticket.id}</span>
                        <Badge variant={status.variant} className='gap-1'>
                          {status.icon}{status.label}
                        </Badge>
                        <Badge variant={priority.variant}>{priority.label}</Badge>
                      </div>
                      <p className='text-sm font-semibold text-foreground'>{ticket.title}</p>
                      <p className='text-xs text-muted-foreground mt-1 line-clamp-2'>{ticket.description}</p>
                      <div className='flex gap-3 mt-2 text-xs text-muted-foreground'>
                        <span>{ticket.category}</span>
                        <span>Por: {ticket.author}</span>
                        <span>{ticket.created}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <div className='text-center py-12 text-muted-foreground'>
              <AlertCircle size={32} className='mx-auto mb-2 opacity-50' />
              <p className='text-sm'>Nenhum chamado encontrado.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
