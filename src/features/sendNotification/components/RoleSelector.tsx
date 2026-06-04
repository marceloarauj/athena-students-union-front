'use client';

import { RoleModel } from '@/features/roles/models/roleModel';
import { NotificationRecipient } from '../models/notificationModel';
import { Check, Users } from 'lucide-react';

type Props = {
  roles: RoleModel[];
  recipients: NotificationRecipient[];
  selectedRoles: string[];
  onToggle: (alias: string) => void;
  onToggleAll: (allAliases: string[]) => void;
};

export function RoleSelector({ roles, recipients, selectedRoles, onToggle, onToggleAll }: Props) {
  const allAliases = roles.map(r => r.alias);
  const allSelected = allAliases.length > 0 && selectedRoles.length === allAliases.length;

  function countForRole(alias: string) {
    return recipients.filter(r => r.role === alias).length;
  }

  return (
    <div className='flex flex-wrap gap-2'>
      <button
        onClick={() => onToggleAll(allAliases)}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
          allSelected
            ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30'
            : 'bg-muted text-muted-foreground border-border hover:border-primary/50 hover:text-primary'
        }`}
      >
        <Users size={14} />
        Todos
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
            allSelected ? 'bg-white/20 text-white' : 'bg-background text-muted-foreground'
          }`}
        >
          {recipients.length}
        </span>
        {allSelected && (
          <span className='absolute -top-1 -right-1 w-4 h-4 bg-primary border-2 border-background rounded-full flex items-center justify-center'>
            <Check size={9} className='text-white' strokeWidth={3} />
          </span>
        )}
      </button>

      {roles.map(role => {
        const active = selectedRoles.includes(role.alias);
        const count = countForRole(role.alias);
        return (
          <button
            key={role.alias}
            onClick={() => onToggle(role.alias)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
              active
                ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30'
                : 'bg-muted text-muted-foreground border-border hover:border-primary/50 hover:text-primary'
            }`}
          >
            {role.name}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                active ? 'bg-white/20 text-white' : 'bg-background text-muted-foreground'
              }`}
            >
              {count}
            </span>
            {active && (
              <span className='absolute -top-1 -right-1 w-4 h-4 bg-primary border-2 border-background rounded-full flex items-center justify-center'>
                <Check size={9} className='text-white' strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
