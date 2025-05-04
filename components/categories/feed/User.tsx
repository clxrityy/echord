'use client';
import { Skeleton, ImageComponent } from '@/components/ui';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { EUser } from '@/prisma/app/generated/prisma/client';
import { BASE_URL } from '@/util';

export function FeedUser({ userId }: Readonly<{ userId: string }>) {
  const [user, setUser] = useState<EUser | null>(null);

  async function fetchUser() {
    const res = await fetch(`${BASE_URL}/api/user?userId=${userId}`, {
      method: 'GET',
      cache: 'no-store',
      next: {
        revalidate: 0,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { user: fetchedUser } = (await res.json()) as { user: EUser };

    if (fetchedUser) {
      setUser(fetchedUser);
    } else {
      setUser(null);
    }
  }

  useEffect(() => {
    if (!userId) {
      return;
    }
    if (!user) {
      fetchUser();
    }
  }, [userId, user]);

  if (user) {
    const { username, avatar } = user;

    return (
      <div className='w-fit h-fit flex items-center justify-start flex-col gap-2'>
        <Link
          href={`/profile/${userId}`}
          className='focus:text-blue-400 transition'
        >
          {username && (
            <div className='flex flex-col md:flex-row items-center justify-start gap-2'>
              {avatar && (
                <ImageComponent
                  fetchPriority='low'
                  src={avatar}
                  alt={username}
                  className='w-10 h-10 rounded-full'
                  width={20}
                  height={20}
                />
              )}
              <p className='text-sm lg:text-base hover:underline transition underline-offset-2'>
                {username}
              </p>
            </div>
          )}
        </Link>
      </div>
    );
  }

  return <Skeleton className='w-20 h-20 rounded-full' />;
}
