'use client';

import { useInstitutionStore } from '@/entities/institution';
import { usePayments } from '@/features/payments/hooks/usePayments';
import { usePermissionGuard } from '@/features/auth/hooks/usePermissionGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Download } from 'lucide-react';

export default function PaymentsPage() {
  const allowed = usePermissionGuard('SHOW_SCREEN_PAYMENTS');
  const { institution } = useInstitutionStore();
  const { data, loading } = usePayments(institution?.alias ?? '');

  if (!allowed) return null;

  if (loading) return (
    <div className='p-6 max-w-4xl mx-auto space-y-4'>
      <Skeleton className='h-8 w-48' />
      <Skeleton className='h-32 w-full' />
      <Skeleton className='h-64 w-full' />
    </div>
  );

  const pending = data?.invoices.filter(i => i.status === 'pending') ?? [];
  const paidPct = data ? (data.summary.totalPaid / data.summary.totalAnnual) * 100 : 0;

  return (
    <div className='p-6 max-w-4xl mx-auto space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-foreground'>Financeiro</h1>
        <p className='text-sm text-muted-foreground mt-1'>Acompanhe seus pagamentos e mensalidades.</p>
      </div>

      {/* Pending alert */}
      {pending.length > 0 && (
        <div className='flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'>
          <AlertCircle size={18} className='text-amber-600 shrink-0 mt-0.5' />
          <div>
            <p className='text-sm font-medium text-amber-800 dark:text-amber-200'>
              Pagamento pendente: {pending[0].month}
            </p>
            <p className='text-xs text-amber-600 dark:text-amber-400'>
              Vencimento: {pending[0].dueDate} — R$ {pending[0].amount.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <Card><CardContent className='p-4 text-center'>
          <p className='text-xl font-bold text-primary'>R$ {data?.summary.totalPaid.toFixed(2)}</p>
          <p className='text-xs text-muted-foreground mt-1'>Total Pago</p>
        </CardContent></Card>
        <Card><CardContent className='p-4 text-center'>
          <p className='text-xl font-bold text-danger'>R$ {data?.summary.totalPending.toFixed(2)}</p>
          <p className='text-xs text-muted-foreground mt-1'>Pendente</p>
        </CardContent></Card>
        <Card><CardContent className='p-4 text-center'>
          <p className='text-xl font-bold text-foreground'>R$ {data?.summary.totalAnnual.toFixed(2)}</p>
          <p className='text-xs text-muted-foreground mt-1'>Total Anual</p>
        </CardContent></Card>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className='p-4'>
          <div className='flex justify-between text-xs text-muted-foreground mb-2'>
            <span>Progresso anual</span>
            <span>{paidPct.toFixed(0)}%</span>
          </div>
          <Progress value={paidPct} />
        </CardContent>
      </Card>

      {/* Invoice table */}
      <Card>
        <CardHeader><CardTitle>Histórico de Faturas</CardTitle></CardHeader>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead className='text-right'>Valor</TableHead>
                <TableHead className='text-center'>Status</TableHead>
                <TableHead className='text-center'>Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.invoices.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell className='font-medium'>{inv.month}</TableCell>
                  <TableCell className='text-muted-foreground'>{inv.dueDate}</TableCell>
                  <TableCell className='text-right'>R$ {inv.amount.toFixed(2)}</TableCell>
                  <TableCell className='text-center'>
                    <Badge variant={inv.status === 'paid' ? 'success' : 'warning'}>
                      {inv.status === 'paid' ? 'Pago' : 'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-center'>
                    <button className='text-primary hover:underline flex items-center gap-1 mx-auto text-xs'>
                      <Download size={12} /> Baixar
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
