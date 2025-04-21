import { Signup } from '@/components/elements/forms/Signup';
import { Window } from '@/components/layout/screen/Window';
import Skeleton from '@/components/ui/Skeleton';
import { Suspense } from 'react';
import Loading from '@/app/loading';
import { connection } from 'next/server';
import { getUserSessionId } from '@/lib';
import { getUserBySessionId } from '@/app/_actions/user';

export const dynamic = 'force-dynamic'; // Force dynamic rendering

export default async function Page() {
  await connection();
  const sessionId = await getUserSessionId();
  const user = await getUserBySessionId(sessionId || '');

  return (
    <Suspense fallback={<Loading />}>
      <Window sessionId={sessionId || ''}>
        <div className='h-full w-full mx-auto'>
          <div className='flex flex-col w-full h-full mx-auto mt-30 gap-6 items-center justify-center'>
            <h2>Sign Up</h2>
            <Suspense fallback={<Skeleton />}>
              <Signup
                sessionId={sessionId ?? sessionId!}
                userId={user?.userId}
              />
            </Suspense>
          </div>
        </div>
      </Window>
    </Suspense>
  );
}
