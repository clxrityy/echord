import type { Metadata } from 'next';
import { Tomorrow } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/nav/Navbar';
import { ReactNode, Suspense } from 'react';
import Skeleton from '@/components/ui/Skeleton';
import { Main } from '@/components/ui/wrappers/Main';

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
        </head>
        <Main>
          <Suspense fallback={<Skeleton />}>
            <Navbar />
          </Suspense>
          {children}
        </Main>
      </body>
    </html>
  );
}
