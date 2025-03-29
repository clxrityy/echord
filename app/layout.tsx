import type { Metadata } from 'next';
import { Tomorrow } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/nav/Navbar';
import { ReactNode, Suspense } from 'react';
import Skeleton from '@/components/ui/Skeleton';
import { Main } from '@/components/ui/wrappers/Main';
import { handleCurrentSession } from '@/handlers/session';

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
      <body className={`${tomorrow.variable} antialiased`}>
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
        <Suspense fallback={<Skeleton />}>
          <Main sessionId={session.sessionId}>
            <Navbar userId={
              session.userId ? session.userId : undefined
            } />
            {children}
          </Main>
        </Suspense>
      </body>
    </html>
  );
}
