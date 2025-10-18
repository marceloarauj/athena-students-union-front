'use client';

import { BellIcon, MenuIcon, MoonIcon, SunIcon } from 'lucide-react';
import UserContainer from './userContainer';
import HeaderButton from './headerButton';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const hideHeader = pathname.endsWith('/login') || pathname.includes('/login/');
  if (hideHeader) return null;

  return (
    <header className='w-full grid grid-cols-2 h-20 bg-transparent border-b border-dark-line px-4'>
      <div className='flex gap-4 w-full align-middle items-center'>
        <div>
          <HeaderButton icon={<MenuIcon />} />
        </div>
        <div>
          <h6 className='text-white font-bold text-center'>Colégio Estadual Tobias Barreto</h6>
        </div>
      </div>

      <div className='flex w-full items-center justify-end gap-2'>
        <div>
          <HeaderButton
            icon={darkMode ? <SunIcon /> : <MoonIcon />}
            onClick={() => setDarkMode(!darkMode)}
          />
        </div>
        <div>
          <HeaderButton icon={<BellIcon />} hasNotification />
        </div>
        <div>
          <UserContainer />
        </div>
      </div>
    </header>
  );
}
