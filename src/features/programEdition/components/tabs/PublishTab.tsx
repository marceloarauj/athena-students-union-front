'use client';

import { useEffect } from 'react';
import { PublishChecklist, ProgramEdition } from '../../models/programEditionModel';
import { CheckCircle, XCircle, Rocket, Archive, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  edition: ProgramEdition;
  checklist: PublishChecklist | null;
  actionLoading: boolean;
  onLoadChecklist: () => Promise<unknown>;
  onPublish: () => Promise<unknown>;
  onClose: () => Promise<unknown>;
}

export function PublishTab({ edition, checklist, actionLoading, onLoadChecklist, onPublish, onClose }: Props) {
  useEffect(() => { onLoadChecklist(); }, []);

  const isPublished = edition.status === 2;
  const isClosed = edition.status === 3;

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>Validação antes de publicar</p>
        <button onClick={onLoadChecklist} disabled={actionLoading}
          className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors disabled:opacity-50'>
          <RefreshCw size={14} /> Atualizar
        </button>
      </div>

      {!checklist ? (
        <div className='space-y-2'>{[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className='h-12 rounded-xl' />)}</div>
      ) : (
        <>
          <div className='space-y-2'>
            {checklist.items.map((item, i) => (
              <div key={i} className={`flex items-center gap-3 rounded-xl p-3 border ${item.passed ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'}`}>
                {item.passed
                  ? <CheckCircle size={16} className='text-green-600 dark:text-green-400 shrink-0' />
                  : <XCircle size={16} className='text-red-500 shrink-0' />
                }
                <div className='flex-1 min-w-0'>
                  <p className={`text-sm font-medium ${item.passed ? 'text-green-800 dark:text-green-300' : 'text-red-700 dark:text-red-400'}`}>
                    {item.label}
                  </p>
                  {item.description && <p className='text-xs text-muted-foreground'>{item.description}</p>}
                </div>
              </div>
            ))}
          </div>

          {!isPublished && !isClosed && (
            <button
              onClick={onPublish}
              disabled={actionLoading || !checklist.canPublish}
              className='w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50'
            >
              <Rocket size={16} /> {actionLoading ? 'Publicando...' : 'Publicar Edição'}
            </button>
          )}

          {isPublished && !isClosed && (
            <button
              onClick={onClose}
              disabled={actionLoading}
              className='w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-muted border border-border text-foreground font-medium hover:bg-muted/70 transition-colors disabled:opacity-50'
            >
              <Archive size={16} /> {actionLoading ? 'Encerrando...' : 'Encerrar Edição'}
            </button>
          )}

          {isClosed && (
            <div className='flex items-center gap-2 bg-muted rounded-xl p-4 text-muted-foreground text-sm'>
              <Archive size={16} />
              Esta edição foi encerrada.
            </div>
          )}
        </>
      )}
    </div>
  );
}
