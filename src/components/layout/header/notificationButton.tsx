'use client';

import { BellIcon } from 'lucide-react';

export default function NotificationButton() {
  const hasNotification: boolean = true;
  return (
    <button
      className={`bg-primary ${
        hasNotification ? 'animate-pulse' : ''
      } relative text-white p-2 rounded-full hover:bg-blue-300 transition duration-300 cursor-pointer`}
    >
      <BellIcon className='w-6 h-6 text-white' />
      {hasNotification && (
        <span className='absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-0.5 size-4'>
          3
        </span>
      )}
    </button>
  );
}
