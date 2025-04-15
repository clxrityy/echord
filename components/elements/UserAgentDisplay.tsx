'use client';

import { UserAgent } from '@/types';
import { useEffect, useState } from 'react';
import Skeleton from '../ui/Skeleton';
import toast from 'react-hot-toast';

export const UserAgentDisplay = () => {
  const [userAgent, setUserAgent] = useState<UserAgent | null>(null);

  useEffect(() => {
    const fetchUserAgent = async () => {
      const toastId = toast.loading('Fetching user agent...');

      try {
        const res = await fetch('/api/session/user-agent', {
          method: 'GET',
          cache: 'no-store',
        });

        if (!res.ok) {
          toast.error('Failed to fetch user agent', {
            id: toastId,
          });
          return;
        }

        const { userAgent } = await res.json();
        if (userAgent) {
          setUserAgent(userAgent);
          toast.success('Fetched user agent', {
            id: toastId,
          });
        } else {
          toast.error('Failed to fetch user agent', {
            id: toastId,
          });
        }
      } catch (e) {
        toast.error('Failed to fetch user agent', {
          id: toastId,
        });
        console.error(e);
      } finally {
        toast.dismiss(toastId);
      }
    };

    fetchUserAgent();
  }, []);

  if (!userAgent) {
    return (
      <Skeleton className='h-[10rem] w-1/2 rounded-xl animate-pulse bg-zinc-600/30' />
    );
  }

  return (
    <div className='flex w-full items-center justify-center'>
      <div className='flex flex-col gap-2'>
        <p className='text-sm text-zinc-400'>
          Browser: {userAgent.browser.name} {userAgent.browser.version}
        </p>
        <p className='text-sm text-zinc-400'>
          Device: {userAgent.device.vendor} {userAgent.device.model}
        </p>
        <p className='text-sm text-zinc-400'>
          OS: {userAgent.os.name} {userAgent.os.version}
        </p>
        {userAgent.cpu.architecture && (
          <p className='text-sm text-zinc-400'>
            CPU: {userAgent.cpu.architecture}
          </p>
        )}
        {userAgent.isBot && (
          <p className='text-sm text-red-500'>Bot detected</p>
        )}
      </div>
    </div>
  );
};
