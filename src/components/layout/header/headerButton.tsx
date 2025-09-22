'use client';

import clsx from 'clsx';

export type HeaderButtonProps = {
  onClick?: () => void;
  icon: React.ReactNode;
  hasNotification?: boolean;
};

export default function HeaderButton({ onClick, icon, hasNotification }: HeaderButtonProps) {
  var buttonStyle = clsx(
    'bg-transparent',
    'relative',
    'border',
    'border-white',
    'text-white',
    'p-2',
    'rounded-full',
    'hover:bg-gray-600',
    'transition',
    'duration-300',
    'cursor-pointer',
    { 'animate-pulse': hasNotification },
  );

  var notificationBadgeStyle = clsx(
    'absolute',
    'top-0',
    'right-0',
    'bg-red-500',
    'text-white',
    'text-xs',
    'font-bold',
    'rounded-full',
    'px-0.5',
    'size-4',
    { hidden: !hasNotification },
  );

  return (
    <button onClick={onClick} className={buttonStyle}>
      {icon}
      {hasNotification && <span className={notificationBadgeStyle}>3</span>}
    </button>
  );
}
