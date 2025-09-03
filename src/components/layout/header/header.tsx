'use client';

import { DarkModeToggle } from './darkModeToggle';
import NotificationButton from './notificationButton';
import UserContainer from './userContainer';

export default function Header() {
  return (
    <header className='w-full h-20 bg-slate-800 shadow-md shadow-gray-400'>
      <div className='flex justify-center md:justify-between items-center h-full px-4'>
        <h1 className='hidden md:block text-white text-2xl font-bold'>Oramel</h1>
        <nav>
          <ul className='flex space-x-4'>
            <li>
              <DarkModeToggle />
            </li>
            <li>
              <NotificationButton />
            </li>
            <li>
              <UserContainer />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
