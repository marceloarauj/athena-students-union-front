'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/16/solid';
import { useEffect, useState } from 'react';

export function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <button
      className='bg-btn-primary text-white p-2 rounded-full hover:bg-blue-300 transition duration-300 cursor-pointer'
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? (
        <SunIcon className='w-6 h-6 text-yellow-500' />
      ) : (
        <MoonIcon className='w-6 h-6 text-white' />
      )}
    </button>
  );
}
