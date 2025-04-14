'use client';
import { useSession } from '@/contexts/session';
import { useWindow } from '@/contexts/window';
import { useScreenSize } from '@/hooks/useScreenSize';
import { ReactNode, useEffect } from 'react';

type WindowProps = {
  sessionId: string;
  children: ReactNode;
};

export const Window = ({ sessionId, children }: WindowProps) => {
  const { setWindowSize, getWindowSize } = useWindow();
  const { width, height } = useScreenSize();
  const { setSessionId, getSessionId } = useSession();

  useEffect(() => {
    if (getWindowSize().width !== width || getWindowSize().height !== height) {
      setWindowSize(width, height);
    }
  }, [width, height]);

  useEffect(() => {
    if (sessionId && sessionId !== getSessionId()) {
      setSessionId(sessionId);
    }
  }, [sessionId]);

  return (
    <div className='w-full h-screen flex justify-end mt-26 relative'>
      <div className='w-full h-full flex items-start justify-center relative'>
        <div className='w-full h-full flex items-start justify-end relative max-w-7xl mx-auto fixed'>
          {children}
        </div>
      </div>
    </div>
  );
};
