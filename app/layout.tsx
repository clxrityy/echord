import type { Metadata } from 'next';
import { Tomorrow } from 'next/font/google';
import './globals.css';
import { ReactNode, Suspense } from 'react';
import Skeleton from '@/components/ui/Skeleton';
import { handleCurrentSession } from '@/handlers/session';
import { SessionProvider } from '@/contexts/session';
import { Navbar } from '@/components/layout/nav/Navbar';

const tomorrow = Tomorrow({
  subsets: ['latin'],
  variable: '--font-tmr',
  display: 'swap',
  weight: ['200', '300', '400', '500', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Echord',
  description: '',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await handleCurrentSession();

  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.ico' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${tomorrow.variable} antialiased`}>
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
          <SessionProvider>
            <Navbar userId={session.userId || undefined} />
          </SessionProvider>
        </Suspense>
        {children}
      </body>
    </html>
  );
}
