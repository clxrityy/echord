import { getUserSessionId } from '@/lib';
import { ReactNode, Suspense } from 'react';
import { getUserBySessionId } from '../_actions';
import { Toaster } from 'react-hot-toast';
import { Skeleton } from '@/components/ui';
import { Navbar } from '@/components/layout';

export default async function RouteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const sessionId = await getUserSessionId();
  const user = await getUserBySessionId(sessionId ?? '');

  return (
    <div className='m-0 p-0 w-screen h-screen z-0 relative'>
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
      <Suspense
        fallback={
          <Skeleton className='w-screen fixed top-0 z-50 shadow-md mx-0 right-0 left-0 h-20 rounded-b-sm animate-pulse' />
        }
      >
        <Navbar userId={user?.userId} />
      </Suspense>
      {children}
    </div>
  );
}
