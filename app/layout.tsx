import type { Metadata } from 'next';
import { Tomorrow } from 'next/font/google';
import './globals.css';
import { ReactNode, Suspense } from 'react';
import Skeleton from '@/components/ui/Skeleton';
import { handleCurrentSession } from '@/handlers/session';
import { SessionProvider } from '@/contexts/session';
import { Navbar } from '@/components/layout/nav/Navbar';
import { Toaster } from 'react-hot-toast';
import { WindowProvider } from '@/contexts/window';
import { BASE_URL } from '@/utils';

const tomorrow = Tomorrow({
  subsets: ['latin'],
  variable: '--font-tmr',
  display: 'swap',
  weight: ['200', '300', '400', '500', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Echord',
  description: 'Echord is a music discovery platform that allows you to find new music based on your listening habits. It uses machine learning algorithms to analyze your listening history and recommend new songs, albums, and artists that you might like.',
  openGraph: {
    title: 'Echord',
    description: 'Echord is a music discovery platform that allows you to find new music based on your listening habits. It uses machine learning algorithms to analyze your listening history and recommend new songs, albums, and artists that you might like.',
    url: 'https://echord.uk',
    siteName: 'Echord',
  },
  twitter: {
    card: 'summary',
    title: 'Echord',
    description: 'Echord is a music discovery platform that allows you to find new music based on your listening habits. It uses machine learning algorithms to analyze your listening history and recommend new songs, albums, and artists that you might like.',
    creator: '@yourclxrity',
    images: [
      {
        url: `${BASE_URL}/android-chrome-512x512.png`,
        alt: 'Echord',
        width: 512,
        height: 512,
      }
    ]
  },
  icons: {
    icon: `${BASE_URL}/favicon.ico`,
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
    other: {
      rel: 'apple-touch-icon',
      url: '/favicon.ico',
    },
  },
  applicationName: 'Echord',
  appLinks: {
    web: {
      url: 'https://echord.uk',
    }
  },
  appleWebApp: {
    title: 'Echord',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
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
          <Toaster position="top-right" toastOptions={{
            custom: {
              className: 'bg-gray-900 text-gray-200 shadow-md rounded-lg border border-gray-700/50',
              style: {
                background: '#0f2862',
                color: '#e5e7eb',
                fontSize: '0.875rem',
                padding: '1rem',
                zIndex: 9999,
              },
            },
            success: {
              duration: 3000,
              style: {
                background: '#3b82f6',
                color: '#ffffff',
                fontSize: '0.875rem',
                padding: '1rem',
              },
            },
            error: {
              duration: 3000,
              style: {
                background: '#9e363a',
                color: '#ffffff',
                fontSize: '0.875rem',
                padding: '1rem',
              },
            },
            loading: {
              duration: 3000,
              style: {
                background: '#4f5f76',
                color: '#ffffff',
                fontSize: '0.875rem',
                padding: '1rem',
              },
            },
          }} />
          <SessionProvider>
            <WindowProvider>
              <Navbar userId={session.userId || undefined} />
              {children}
            </WindowProvider>
          </SessionProvider>
        </Suspense>
      </body>
    </html>
  );
}
