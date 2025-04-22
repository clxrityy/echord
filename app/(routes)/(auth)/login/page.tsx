import { Login } from '@/components/elements/forms';
import { Window } from '@/components/layout/screen';
import { Skeleton } from '@/components/ui';
import Link from 'next/link';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import Loading from '@/app/loading';
import { getUserSessionId } from '@/lib';
import { getUserBySessionId } from '@/app/_actions';

export const dynamic = 'force-dynamic';

export default async function Page() {
  await connection();
  const sessionId = await getUserSessionId();
  const user = await getUserBySessionId(sessionId || '');

  if (user) {
    return redirect(`/profile/${user.userId}`);
  }

  return (
    <Suspense fallback={<Loading />}>
      <Window sessionId={sessionId || ''}>
        <div className='w-full h-full mx-auto flex items-center justify-start'>
          <div className='flex flex-col w-full h-full mx-auto gap-6 items-center justify-center'>
            <h2>Login</h2>
            <Suspense fallback={<Skeleton />}>
              <Login sessionId={sessionId ?? sessionId!} />
            </Suspense>
            <Link
              href={'/signup'}
              className='text-sm text-gray-300 hover:text-gray-200/80 transition duration-200 focus:underline'
            >
              Don&#39;t have an account? Sign up here.
            </Link>
          </div>
        </div>
      </Window>
    </Suspense>
  );
}
