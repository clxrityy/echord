"use client";
import { SessionProvider, useSession } from '@/contexts/session';
import { ReactNode } from 'react';

export function Main({ children, sessionId }: { children: ReactNode; sessionId?: string }) {

  const { setSessionId } = useSession();

  if (sessionId) {
    setSessionId(sessionId);
  }

  return (
    <div className='w-full max-w-7xl mx-auto px-4 py-2 relative'>
      <SessionProvider>
        {children}
      </SessionProvider>
    </div>
  );
}
