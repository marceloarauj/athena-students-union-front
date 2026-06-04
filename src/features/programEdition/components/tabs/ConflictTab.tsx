'use client';

import { ConflictReport } from '../../models/programEditionModel';
import { AlertTriangle, CheckCircle, Search } from 'lucide-react';

interface Props {
  conflictReport: ConflictReport | null;
  actionLoading: boolean;
  onRunDetection: () => Promise<unknown>;
}

export function ConflictTab({ conflictReport, actionLoading, onRunDetection }: Props) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>Detecção automática de conflitos na grade horária</p>
        <button
          onClick={onRunDetection}
          disabled={actionLoading}
          className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50'
        >
          <Search size={14} /> {actionLoading ? 'Analisando...' : 'Detectar Conflitos'}
        </button>
      </div>

      {!conflictReport ? (
        <div className='text-center py-12 text-muted-foreground'>
          <AlertTriangle size={32} className='mx-auto mb-2 opacity-40' />
          <p className='text-sm'>Execute a detecção para analisar conflitos.</p>
        </div>
      ) : conflictReport.hasConflicts ? (
        <div className='space-y-2'>
          <div className='flex items-center gap-2 text-yellow-600 dark:text-yellow-400'>
            <AlertTriangle size={16} />
            <span className='text-sm font-medium'>{conflictReport.conflicts.length} conflito(s) encontrado(s)</span>
          </div>
          {conflictReport.conflicts.map((c, i) => (
            <div key={i} className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4'>
              <p className='text-sm font-medium text-yellow-800 dark:text-yellow-300'>{c.description}</p>
              <p className='text-xs text-yellow-600 dark:text-yellow-400 mt-1'>Tipo: {c.type}</p>
              {c.affectedGroups.length > 0 && (
                <p className='text-xs text-yellow-600 dark:text-yellow-400'>Turmas: {c.affectedGroups.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className='flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4'>
          <CheckCircle size={20} className='text-green-600 dark:text-green-400 shrink-0' />
          <div>
            <p className='text-sm font-medium text-green-800 dark:text-green-300'>Nenhum conflito encontrado</p>
            <p className='text-xs text-green-600 dark:text-green-400'>A grade horária está sem inconsistências.</p>
          </div>
        </div>
      )}
    </div>
  );
}
