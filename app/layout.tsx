import type { Metadata } from 'next';
import { AR_One_Sans} from 'next/font/google';
import './globals.css';
import { ReactNode, Suspense } from 'react';
import Skeleton from '@/components/ui/Skeleton';
import { handleCurrentSession } from '@/app/_handlers/session';
import { SessionProvider } from '@/contexts/session';
import { Navbar } from '@/components/layout/nav/Navbar';
import { Toaster } from 'react-hot-toast';
import { WindowProvider } from '@/contexts/window';
import { BASE_URL } from '@/utils';
import { connection } from 'next/server';
import { Backdrop } from '@/components/layout/screen/Backdrop';
import type { Viewport } from 'next';

const FONT = AR_One_Sans({
  subsets: ['latin'],
  variable: '--font-ar',
  display: 'swap',
});

export const metadata: Metadata = {
  keywords: [
    'Echord',
    'Music',
    'Music Discovery',
    'Music Recommendation',
    'Music Platform',
    'Music Streaming',
    'Music Player',
    'Music Library',
    'Music Collection',
    'Music Sharing',
    'Music Community',
    'Music Social Network',
    'Music Analytics',
    'Music Data Visualization',
    'Music Trends',
    'Music Insights',
    'Music Charts',
  ],
  title: 'Echord',
  description:
    'Echord is a music cataloging/discovery/reviewing platform that allows you to find new music based on your listening habits. It uses machine learning algorithms to analyze your listening history and recommend new songs, albums, and artists that you might like.',
  openGraph: {
    title: 'Echord',
    description:
      'Echord is a music discovery platform that allows you to find new music based on your listening habits. It uses machine learning algorithms to analyze your listening history and recommend new songs, albums, and artists that you might like.',
    url: 'https://echord.uk',
    siteName: 'Echord',
  },
  twitter: {
    card: 'summary',
    title: 'Echord',
    description:
      'Echord is a music discovery platform that allows you to find new music based on your listening habits. It uses machine learning algorithms to analyze your listening history and recommend new songs, albums, and artists that you might like.',
    creator: '@yourclxrity',
    images: [
      {
        url: `${BASE_URL}/android-chrome-512x512.png`,
        alt: 'Echord',
        width: 512,
        height: 512,
      },
    ],
  },
  icons: {
    icon: `${BASE_URL}/favicon.ico`,
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
    other: {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
  },
  applicationName: 'Echord',
  appLinks: {
    web: {
      url: 'https://echord.uk',
    },
  },
  appleWebApp: {
    title: 'Echord',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: 'dark',
  themeColor: [
    {
      media: '(prefers-color-scheme: dark)',
      color: '#294380',
    },
    {
      media: '(prefers-color-scheme: light)',
      color: '#8fc0c9',
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  await connection();

  const session = await handleCurrentSession();

  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.ico' />
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
      <body className={`${FONT.variable} antialiased`}>
        <Suspense fallback={<Skeleton className='w-full h-full' />}>
          <Toaster
            position='top-right'
            toastOptions={{
              custom: {
                className:
                  'bg-gray-900 text-gray-200 shadow-md rounded-lg border border-gray-700/50',
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
            }}
          />
          <SessionProvider>
            <WindowProvider>
              <Backdrop />
              <Navbar userId={session.userId || undefined} />
              {children}
            </WindowProvider>
          </SessionProvider>
        </Suspense>
      </body>
    </html>
  );
}
