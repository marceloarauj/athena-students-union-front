import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Athena Students Union',
  description: 'Software de gestão de ensino',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-br' suppressHydrationWarning>
      <body>
        <ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
          {children}
          <Toaster richColors position='top-right' />
        </ThemeProvider>
      </body>
    </html>
  );
}
