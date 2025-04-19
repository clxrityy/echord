import { handleCurrentSession } from '@/app/_actions/session';
import Loading from '@/app/loading';
import { UserAgentDisplay } from '@/components/elements/UserAgentDisplay';
import { Window } from '@/components/layout/screen/Window';
import Skeleton from '@/components/ui/Skeleton';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { Suspense } from 'react';

export default async function Page() {
  await connection();

  const session = await handleCurrentSession();

  if (!session.userId) {
    return redirect('/');
  }

  return (
    <Suspense fallback={<Loading />}>
      <Window sessionId={session.sessionId || ''}>
        <div className='flex flex-col w-full gap-6 items-center py-5'>
          <h3>User Agent</h3>
          <Suspense
            fallback={
              <Skeleton className='h-[10rem] w-1/2 rounded-xl animate-pulse bg-zinc-600/30' />
            }
          >
            <UserAgentDisplay />
          </Suspense>
        </div>
      </Window>
    </Suspense>
  );
}
