'use client';

import { useEffect } from 'react';

type ThemeProps = {
  children: React.ReactNode;
  theme: {
    primary: string;
    secondary: string;
  };
};

export default function ThemeContainer({ children, theme }: ThemeProps) {
  useEffect(() => {
    if (theme) {
      document.documentElement.style.setProperty('--primary', theme.primary);
      document.documentElement.style.setProperty('--secondary', theme.secondary);
    }
  }, [theme]);

  return <>{children}</>;
}
