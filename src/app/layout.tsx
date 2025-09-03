import type { Metadata } from 'next';
import './globals.css';
import ThemeContainer from '@/components/layout/theme/themeContainer';
import { ThemeRepository } from '@/components/layout/theme/themeRepository';
import Header from '@/components/layout/header/header';

export const metadata: Metadata = {
  title: 'Oramel',
  description: 'Software de gestão de ensino',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const repo = new ThemeRepository();
  const theme = await repo.getTheme();

  return (
    <html lang='pt-br'>
      <body>
        <ThemeContainer theme={theme}>
          <Header />
          {children}
        </ThemeContainer>
      </body>
    </html>
  );
}
