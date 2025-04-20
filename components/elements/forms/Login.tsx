'use client';

import { useSession } from '@/contexts/session';
import { useWindow } from '@/contexts/window';
import { BASE_URL, ICONS } from '@/utils';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

export const Login = ({
  sessionId,
  userId,
}: {
  sessionId: string;
  userId?: string | null;
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { getUserAgent } = useWindow();

  const userAgent = getUserAgent();

  const { setUserId } = useSession();
  const router = useRouter();

  if (userId) {
    setUserId(userId);
    router.push(`/profile/${userId}`);
  }

  const handleLogin = useCallback(async () => {
    const toastId = toast.loading('Logging in...');
    try {
      const { id } = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          username,
          password,
          userAgent,
          sessionId,
        }),
      }).then((res) => res.json());

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
