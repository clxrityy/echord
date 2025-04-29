'use client';

import { useSession } from '@/contexts';
import { ESession } from '@/prisma/app/generated/prisma/client';
import { BASE_URL, ICONS } from '@/utils';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const Login = ({
  sessionId,
  userId,
}: {
  sessionId?: string;
  userId?: string | null;
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [session, setSession] = useState<ESession | null>(null);

  const { setUserId } = useSession();
  const router = useRouter();

  if (userId) {
    setUserId(userId);
    router.push(`/profile/${userId}`);
  }

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch(`/api/session`);
      const { session } = (await res.json()) as { session: ESession | null };
      setTimeout(() => {
        if (session) {
          setSession(session);
        } else {
          setSession(null);
        }
      }, 1000);
    } catch (error) {
      console.error('Error fetching session:', error);
      setSession(null);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      fetchSession();
    }
    if (session) {
      setUserId(session.userId);
      router.push(`/profile/${session.userId}`);
    }

  }, [sessionId, session, fetchSession]);

  const handleLogin = useCallback(async () => {
    const toastId = toast.loading('Logging in...');
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          username,
          password,
          sessionId,
        }),
      });

      const { id } = (await res.json()) as { id: string | null };

      if (id) {
        setUserId(id);
        toast.success('Login successful!', { id: toastId });
        router.refresh();
        // Redirect to the profile page
        router.push(`/profile/${id}`);
      } else {
        toast.error('Login failed. Please check your credentials.', {
          id: toastId,
        });
      }
    } catch (e) {
      console.error('Login error:', e);
      toast.error('Login error. Please try again.');
    } finally {
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 5000);
    }
  }, [username, password, sessionId, setUserId]);

  return (
    <form className='flex flex-col w-full h-auto mx-auto gap-5'>
      <div className='flex flex-col xl:flex-row items-center justify-center gap-2 text-center mb-2'>
        <label htmlFor='username'>Username</label>
        <input
          required
          type='text'
          id='username'
          value={username}
          onChange={(e) => {
            e.preventDefault();
            setUsername(e.target.value);
          }}
          className='border border-gray-300 rounded-md p-2'
        />
      </div>
      <div className='flex flex-col xl:flex-row items-center justify-center gap-2 text-center mb-2'>
        <label htmlFor='password'>Password</label>
        <input
          required
          type='password'
          id='password'
          value={password}
          onChange={(e) => {
            e.preventDefault();
            setPassword(e.target.value);
          }}
          className='border border-gray-300 rounded-md p-2'
        />
      </div>
      <div className='flex items-center justify-center w-full'>
        <button
          type='button'
          onClick={handleLogin}
          className='bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition duration-200 w-1/3'
        >
          Login <ICONS.login className='h-5 w-5 inline-block' />
        </button>
      </div>
    </form>
  );
};
