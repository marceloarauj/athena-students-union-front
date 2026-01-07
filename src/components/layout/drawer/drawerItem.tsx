'use client';

import { TvIcon } from 'lucide-react';
import React from 'react';

type DrawerItemProps = {
  text: string;
  onClick?: () => void;
  icon?: React.ReactNode;
};

export default function DrawerItem({ text, onClick, icon }: DrawerItemProps) {
  const baseIconClasses = 'group-hover:scale-110 transition-transform duration-300';

  const iconElement =
    icon && React.isValidElement<{ className?: string }>(icon) ? (
      React.cloneElement(icon, {
        className: `${(icon.props?.className ?? '').trim()} ${baseIconClasses}`.trim(),
      })
    ) : (
      <TvIcon className={baseIconClasses} />
    );

  return (
    <div className='flex flex-row gap-3 w-100 cursor-pointer group' onClick={onClick}>
      {iconElement}
      <span className='text-xl origin-left transition-transform duration-300 group-hover:scale-110'>
        {text}
      </span>
    </div>
  );
}
