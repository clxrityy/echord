'use client';
import { useWindow, useSession } from '@/contexts';
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
      const res = await fetch(
        `/api/session/user-agent?sessionId=${sessionId}`,
        {
          cache: 'no-store',
          method: 'GET',
        }
      );
      const { userAgent } = await res.json();
      return userAgent;
    }

    if (!usr && sessionId) {
      fetchUserAgent().then((res) => {
        if (res) {
          setUserAgentObject(res);
        }
      });
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
  }, [userAgentObject, usr, sessionId]);

  useEffect(() => {
    async function addUserAgent() {
      const res = await fetch(
        `/api/session/user-agent?sessionId=${sessionId}`,
        {
          method: 'POST',
        }
      );

      const data = await res.json();
      return data;
    }
    if (usr && sessionId) {
      addUserAgent()
        .then((res) => {
          if (res.userAgent) {
            setUserAgentObject(res.userAgent);
          }
        })
        .catch((err) => {
          console.error('Error adding user agent:', err);
        });
    }
  }, [usr, sessionId]);

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
