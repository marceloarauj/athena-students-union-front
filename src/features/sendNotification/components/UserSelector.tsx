'use client';

import { useState } from 'react';
import { Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NotificationRecipient } from '../models/notificationModel';

type Props = {
  recipients: NotificationRecipient[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  onToggleAll: () => void;
};

export function UserSelector({ recipients, selectedIds, onToggle, onToggleAll }: Props) {
  const [search, setSearch] = useState('');

  const filtered = recipients.filter(r => {
    const q = search.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q);
  });

  const allSelected = recipients.length > 0 && selectedIds.length === recipients.length;

  return (
    <div className='space-y-3'>
      {/* Search + select all */}
      <div className='flex gap-2'>
        <div className='relative flex-1'>
          <Search size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none' />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Buscar por nome ou e-mail...'
            className='w-full h-9 pl-8 pr-3 text-sm border border-border bg-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'
          />
        </div>
        <button
          onClick={onToggleAll}
          className={cn(
            'px-3 h-9 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap',
            allSelected
              ? 'bg-primary text-white border-primary'
              : 'border-border text-muted-foreground hover:border-primary/50 hover:text-primary',
          )}
        >
          {allSelected ? 'Desmarcar todos' : 'Selecionar todos'}
        </button>
      </div>

      {/* List */}
      <div className='max-h-64 overflow-y-auto rounded-lg border border-border divide-y divide-border'>
        {filtered.length === 0 ? (
          <p className='text-sm text-muted-foreground text-center py-8'>
            Nenhum usuário encontrado.
          </p>
        ) : (
          filtered.map(r => {
            const selected = selectedIds.includes(r.id);
            return (
              <button
                key={r.id}
                onClick={() => onToggle(r.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                  selected ? 'bg-primary/5' : 'hover:bg-muted/50',
                )}
              >
                {/* Checkbox indicator */}
                <div
                  className={cn(
                    'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors',
                    selected ? 'bg-primary border-primary' : 'border-border',
                  )}
                >
                  {selected && <Check size={11} className='text-white' strokeWidth={3} />}
                </div>

                {/* Avatar initials */}
                <div
                  className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0'
                  style={{ backgroundColor: stringToColor(r.name) }}
                >
                  {initials(r.name)}
                </div>

                {/* Info */}
                <div className='min-w-0 flex-1'>
                  <p className='text-sm font-medium text-foreground truncate'>{r.name}</p>
                  <p className='text-xs text-muted-foreground truncate'>{r.email}</p>
                </div>

                {/* Role badge */}
                <span className='text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border font-medium shrink-0'>
                  {r.role}
                </span>
              </button>
            );
          })
        )}
      </div>

      {filtered.length > 0 && (
        <p className='text-xs text-muted-foreground'>
          {filtered.length} usuário(s) · {selectedIds.length} selecionado(s)
        </p>
      )}
    </div>
  );
}

function initials(name: string) {
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}
