'use client';

import { BellIcon, MenuIcon, MoonIcon, SunIcon } from 'lucide-react';
import UserContainer from './userContainer';
import HeaderButton from './headerButton';
import { useEffect, useState } from 'react';

export default function Header() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <header className='w-full h-20 bg-transparent border-b border-dark-line'>
      <div className='flex justify-between items-center h-full px-8'>
        <div>
          <HeaderButton icon={<MenuIcon />} />
          <div className='hidden md:inline-block'>
            <h6 className='text-white font-bold text-center text-sm'>
              Colégio Estadual Tobias Barreto
            </h6>
          </div>
        </div>

        <div>
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
      </div>
    </header>
  );
}
