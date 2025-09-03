'use client';

import { useEffect } from 'react';

type ThemeProps = {
  children: React.ReactNode;
  theme: {
    primary: string;
    secondary: string;
    danger: string;
  };
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
