import {
  FeedList,
  FeedListItemSkeleton,
  FeedListItem,
} from '@/components/elements/feed/FeedList';
import { Hero } from '@/components/elements/Hero';
import { Window } from '@/components/layout/screen/Window';
import Skeleton from '@/components/ui/Skeleton';
import { handleCurrentSession } from '@/app/_actions/session';
import { db } from '@/lib/db';
import { Suspense } from 'react';
import { FEED_ITEMS_PER_PAGE } from '@/utils';
import { getUserBySessionId } from '@/app/_actions/user';
import { FeedItem } from '../components/elements/feed/Feed';
import Loading from './loading';

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

  const array = Array.from(rawFeed).map(async (item) => {
    const { ...interaction } = item;
    const { ...data } = await db.eData.findUnique({
      where: {
        id: item.dataId,
      },
    });
    const { ...interactionData } = await db.eInteractionData.findFirst({
      where: {
        dataId: item.dataId,
      },
    });

    const user = await getUserBySessionId(data.sessionId);

    return {
      interaction,
      data,
      interactionData,
      user,
    };
  });

  const feedItems = await Promise.all(array);

  return (
    <main className='w-full h-full relative items-center justify-center mx-auto flex flex-col gap-10 mt-20 pt-8 xl:mt-10 2xl:mt-0 overflow-y-auto 2xl:overflow-clip scroll-smooth'>
      {/**
       *
       */}
      <div className='w-full h-full flex flex-col xl:flex-row gap-2 items-start justify-start xl:justify-between xl:items-start xl:gap-0'>
        <Suspense fallback={<Loading />}>
          <Hero userId={session!.userId ?? session?.userId!} />
        </Suspense>
        <div className='relative flex justify-center items-center w-full'>
          <Suspense fallback={<Loading />}>
            <Window sessionId={session!.userId ?? session?.userId!}>
              <div className='w-full h-fit flex items-center justify-center relative pb-20'>
                <Suspense
                  fallback={
                    <Skeleton className='w-full h-full bg-gray-400/30 animate-pulse rounded-full shadow-2xl' />
                  }
                >
                  <FeedList itemsPerPage={FEED_ITEMS_PER_PAGE}>
                    {feedItems.map((item, idx) => {
                      const {
                        interaction,
                        data,
                        interactionData,
                        user: userData,
                      } = item;

                      return (
                        <Suspense
                          key={idx}
                          fallback={<FeedListItemSkeleton key={idx} />}
                        >
                          <FeedListItem key={idx}>
                            {interaction &&
                            data &&
                            interactionData &&
                            userData ? (
                              <FeedItem
                                interaction={interaction}
                                data={data}
                                interactionData={interactionData}
                                userId={session?.userId ?? session?.userId!}
                                username={
                                  userData.username ? userData.username : null
                                }
                              />
                            ) : (
                              <Skeleton className='w-full h-20 rounded-md animate-pulse' />
                            )}
                          </FeedListItem>
                        </Suspense>
                      );
                    })}
                  </FeedList>
                </Suspense>
              </div>
            </Window>
          </Suspense>
        </div>
      </div>
    </main>
  );
}
