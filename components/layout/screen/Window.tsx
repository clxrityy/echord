'use client';
import { useSession } from '@/contexts/session';
import { useWindow } from '@/contexts/window';
import { useScreenSize } from '@/hooks/useScreenSize';
import { EUserAgent } from '@/prisma/app/generated/prisma/client';
import { UserAgent } from '@/types';
import { ReactNode, useEffect, useState } from 'react';

type WindowProps = {
  sessionId: string;
  children: ReactNode;
};

export const Window = ({ sessionId, children }: WindowProps) => {
  const { setWindowSize, getWindowSize, setUserAgent, getUserAgent } =
    useWindow();
  const { width, height } = useScreenSize();
  const { setSessionId, getSessionId } = useSession();

  const [userAgentObject, setUserAgentObject] = useState<UserAgent | null>(
    null
  );

  const usr = getUserAgent();

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

  useEffect(() => {
    async function fetchUserAgent() {
      const res = await fetch('/api/session/user-agent', {
        method: 'GET',
        cache: "force-cache",
      });

      if (!res.ok) {
        console.error('Failed to fetch user agent');
        return;
      }

      const { userAgent } = await res.json();
      setUserAgentObject(userAgent);
    }

    if (!usr) {
      fetchUserAgent();
    }

    if (userAgentObject && !usr) {
      const agent: Partial<EUserAgent> = {
        sessionId: getSessionId(),
        os: `${userAgentObject.os.name} ${userAgentObject.os.version}`,
        browser: `${userAgentObject.browser.name} ${userAgentObject.browser.version}`,
        device: `${userAgentObject.device.vendor} ${userAgentObject.device.model} ${userAgentObject.device.type}`,
      };

      setUserAgent(agent);
    }
  }, [userAgentObject]);

  useEffect(() => {
    async function addUserAgent() {
      const res = await fetch('/api/session/user-agent', {
        method: 'POST',
      });

      if (!res.ok) {
        console.error('Failed to add user agent');
      }
    }
    if (usr) {
      addUserAgent();
    }
  }, []);

  return (
    <div className='w-full h-screen flex justify-end mt-26 relative'>
      <div className='w-full h-full flex items-start justify-center relative'>
        <div className='w-full h-full flex items-start justify-end relative max-w-7xl mx-auto'>
          {children}
        </div>
      </div>
    </div>
  );
};
