'use client';

import { cn } from '@/lib/utils';

type DrawerItemProps = {
  text: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
};

export default function DrawerItem({ text, onClick, icon, danger }: DrawerItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer',
        danger
          ? 'text-danger hover:bg-danger/10'
          : 'text-foreground hover:bg-primary/10 hover:text-primary'
      )}
    >
      <span className='shrink-0'>{icon}</span>
      <span>{text}</span>
    </button>
  );
}
