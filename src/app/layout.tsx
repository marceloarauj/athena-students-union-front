import type { Metadata } from 'next';
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
    <html lang='pt-br'>
      <body>{children}</body>
    </html>
  );
}
