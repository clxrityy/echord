import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ReactNode, Suspense } from 'react';
import { Skeleton } from '@/components/ui';
import { Navbar, Backdrop } from '@/components/layout';
import { Toaster } from 'react-hot-toast';
import { BASE_URL } from '@/util';
import { connection } from 'next/server';
import { AR, TMR, Rubica } from '@/styles/fonts';
import { getUserSessionId } from '@/lib';
import { getUserBySessionId } from '@/app/_actions';
import { SessionProvider } from '@/contexts/session';
import { WindowProvider } from '@/contexts/window';
import { InteractionProvider } from '@/contexts/interaction';
import { Analytics } from '@vercel/analytics/react';

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
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/android-chrome-512x512.png`,
        alt: 'Echord',
        width: 512,
        height: 512,
      },
      {
        url: `${BASE_URL}/android-chrome-192x192.png`,
        alt: 'Echord',
        width: 192,
        height: 192,
      },
    ],
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
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
      {
        rel: 'icon',
        sizes: '192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'icon',
        sizes: '512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
    origin: BASE_URL,
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

  const sessionId = await getUserSessionId();
  const user = await getUserBySessionId(sessionId ?? '');

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
        <meta
          property='og:image'
          content={`${BASE_URL}/android-chrome-512x512.png`}
        />
      </head>
      <body
        className={`${AR.variable} ${TMR.variable} ${Rubica.variable} antialiased`}
      >
        <Suspense fallback={<Skeleton className='w-full h-full' />}>
          <SessionProvider>
            <WindowProvider>
              <InteractionProvider>
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
                <Backdrop />
                <Suspense
                  fallback={
                    <Skeleton className='w-screen fixed top-0 z-50 shadow-md mx-0 right-0 left-0 h-20 rounded-b-sm animate-pulse' />
                  }
                >
                  <Navbar userId={user?.userId} />
                </Suspense>
                {children}
              </InteractionProvider>
            </WindowProvider>
          </SessionProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
