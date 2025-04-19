import { FeedItem } from '@/components/elements/feed/Feed';
import {
  FeedList,
  FeedListItem,
} from '@/components/elements/feed/FeedList';
import { Hero } from '@/components/elements/Hero';
import { Window } from '@/components/layout/screen/Window';
import Skeleton from '@/components/ui/Skeleton';
import { handleCurrentSession } from '@/app/_handlers/session';
import { db } from '@/lib/db';
import { Suspense } from 'react';
import { FEED_ITEMS_PER_PAGE } from '@/utils';
import { getUserBySessionId } from './_handlers/user';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await handleCurrentSession();

  const rawFeed = await db.eInteraction.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      interactionType: {
        notIn: ['UNFOLLOWED', 'FOLLOWED'],
      },
    },
  });

  return (
    <main className='w-full h-full relative items-center justify-center mx-auto flex flex-col gap-10 mt-20 pt-8 xl:mt-10 2xl:mt-0 overflow-y-auto 2xl:overflow-clip scroll-smooth'>
      {/**
       *
       */}
      <div className='w-full h-full xl:h-[100vh] flex flex-col xl:flex-row gap-2 items-start justify-start xl:justify-between xl:items-start xl:gap-0'>
        <Suspense fallback={<Skeleton className='w-full h-full animate-pulse bg-gray-500/50' />}>
          <Window sessionId={session!.userId ?? session?.userId!}>
            <Hero userId={session!.userId ?? session?.userId!} />
          </Window>
        </Suspense>
        <div className='relative flex justify-center items-center w-full mt-20'>
          <div className='w-full h-fit flex items-center justify-center relative pb-20'>
            <FeedList itemsPerPage={FEED_ITEMS_PER_PAGE}>
              {Array.from(rawFeed).map(async (item, idx) => {
                const { ...interaction } = item;
                const { ...data } = await db.eData.findUnique({
                  where: {
                    id: item.dataId,
                  },
                });
                const { ...interactionData } =
                  await db.eInteractionData.findFirst({
                    where: {
                      dataId: item.dataId,
                    },
                  });

                const user = await getUserBySessionId(data.sessionId);

                return (
                    <FeedListItem key={idx}>
                      {interaction && data && interactionData ? (
                        <FeedItem
                          interaction={interaction}
                          data={data}
                          interactionData={interactionData}
                          userId={session!.userId ?? session?.userId!}
                          username={user?.username ? user.username : null}
                        />
                      ) : (
                        <Skeleton className='w-full h-20 rounded-md' />
                      )}
                    </FeedListItem>
                );
              })}
            </FeedList>
          </div>
        </div>

      </div>
    </main>
  );
}
