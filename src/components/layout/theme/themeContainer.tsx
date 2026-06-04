'use client';

import { useEffect } from 'react';
import { ThemeModel } from './theme';

type ThemeProps = {
  children: React.ReactNode;
  theme: ThemeModel;
};

export default function ThemeContainer({ children, theme }: ThemeProps) {
  useEffect(() => {
    if (theme) {
      document.documentElement.style.setProperty('--primary', theme.primary);
      document.documentElement.style.setProperty('--secondary', theme.secondary);
      document.documentElement.style.setProperty('--danger', theme.danger);
    }
  }, [theme]);

  return <>{children}</>;
}
