import {
  FeedList,
  FeedListItemSkeleton,
  FeedListItem,
  FeedItem
} from '@/components/elements/feed';
import { Hero } from '@/components/elements/Hero';
import { Window } from '@/components/layout/screen/Window';
import Skeleton from '@/components/ui/Skeleton';
import { Suspense } from 'react';
import { BASE_URL, FEED_ITEMS_PER_PAGE } from '@/utils';
import Loading from './loading';
import {
  EData,
  EInteraction,
  EInteractionData,
  EUser,
} from '@/prisma/app/generated/prisma/client';
import { getUserSessionId } from '@/lib';
import { getUserBySessionId } from '@/app/_actions';

export default async function Home() {
  const sessionId = await getUserSessionId();
  const user = await getUserBySessionId(sessionId || '');

  const feedRes = await fetch(`${BASE_URL}/api/feed`, {
    next: {
      revalidate: 60,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const { feedItems } = await feedRes.json();

  return (
    <main className='w-full h-full relative items-center justify-center mx-auto flex flex-col gap-10 mt-20 pt-8 xl:mt-10 2xl:mt-0 overflow-y-auto 2xl:overflow-clip scroll-smooth'>
      {/**
       *
       */}
      <div className='w-full h-full flex flex-col xl:flex-row gap-2 items-start justify-start xl:justify-between xl:items-start xl:gap-0'>
        <Suspense fallback={<Loading />}>
          <Hero userId={sessionId ?? sessionId!} />
        </Suspense>
        <div className='relative flex justify-center items-center w-full'>
          <Suspense fallback={<Loading />}>
            <Window sessionId={sessionId ?? sessionId!}>
              <div className='w-full h-fit flex items-center justify-center relative pb-20'>
                <Suspense
                  fallback={
                    <Skeleton className='w-full h-full bg-gray-400/30 animate-pulse rounded-full shadow-2xl' />
                  }
                >
                  <FeedList itemsPerPage={FEED_ITEMS_PER_PAGE}>
                    {feedItems.map(
                      (
                        item: {
                          interaction: EInteraction;
                          data: EData;
                          interactionData: EInteractionData;
                          user: EUser;
                        },
                        idx: number
                      ) => {
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
                                  userId={user?.userId || ''}
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
                      }
                    )}
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
