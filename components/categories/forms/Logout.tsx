'use client';
import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function LogoutButton() {
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleClick = async () => {
    const toastId = toast.loading('Logging out...');

    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        toast.success('Logout successful!', { id: toastId });
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 2000);
      }

      if (res.status === 500) {
        console.error('Error logging out');
      }
    } catch (e) {
      console.error('Error logging out', e);
      setError('An error occurred while logging out. Please try again.');
    } finally {
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 5000);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4 w-full'>
      <Button
        onClick={async () => await handleClick()}
        aria-label='Logout'
        className='px-4 py-2 text-lg font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
      >
        Logout
      </Button>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
}
