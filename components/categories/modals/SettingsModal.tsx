'use client';
import { type DialogProps, Button, Dialog, Skeleton } from '@/components/ui';
import { User } from '@/types';
import { ICONS } from '@/util';
import { Suspense, useCallback, useEffect, useState } from 'react';

interface SettingsModalProps extends Partial<DialogProps> {
  userId: string;
}

export function SettingsModal({
  userId,
  ...props
}: Readonly<SettingsModalProps>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const onClose = useCallback(() => {
    setOpen(false);
  }, [open]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user?userId=${userId}`, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          setError('Failed to fetch user');
        }
        const { user: userData } = await res.json();
        if (userData) {
          setUser(userData);
        }
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError('Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    if (!user && userId) {
      fetchUser();
    }
  }, [userId, user]);

  const { settings: IconSettings } = ICONS;

  return (
    <Suspense>
      <Button
        disabled={loading}
        onClick={() => setOpen((prev) => !prev)}
        className='disabled:cursor-none text-xl'
      >
        {loading ? (
          <Skeleton className='w-6 h-6 bg-gray-400/30 animate-pulse rounded-full shadow-2xl' />
        ) : (
          <IconSettings className='h-6 w-6' />
        )}
        <span className='sr-only'>Settings</span>
      </Button>
      <Dialog {...props} open={open} onClose={onClose}>
        <div className='flex flex-col items-start justify-start w-full gap-2'>
          <h2 className='text-lg font-semibold'>Settings</h2>
          <p className='text-gray-400'>
            Manage your settings and preferences here.
          </p>
          {loading && !error ? (
            <Skeleton className='w-full h-full bg-gray-400/30 animate-pulse rounded-full shadow-2xl' />
          ) : (
            <div className='flex flex-col items-start justify-start w-full gap-2'>
              <h3 className='text-md font-semibold'>User Information</h3>
              <p className='text-gray-600'>Username: {user?.username}</p>
            </div>
          )}
        </div>
      </Dialog>
    </Suspense>
  );
}
