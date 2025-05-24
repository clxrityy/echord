import { Suspense } from 'react';
import { SavesGrid, Favorites, UserBox } from '@/components/categories/user';
import { Window } from '@/components/layout';
import Loading from '@/app/loading';
import { db, getUserSessionId } from '@/lib';
import { Skeleton } from '@/components/ui';
import {
  FeedItem,
  FeedList,
  FeedListItem,
  FeedListItemSkeleton,
} from '@/components/categories/feed';
import { Interaction } from '@/types';
import { v4 as uuid } from 'uuid';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const id = (await params).id;

  const profileUser = await db.eUser.findUnique({
    where: {
      userId: id,
    },
  });

  const sessionId = await getUserSessionId();

  if (!profileUser) {
    return <h1 className='mt-30'>User not found</h1>;
  }

  const getFavorites = async () => {
    const allFavorites = await db.eInteractionData.findMany({
      where: {
        interactionType: 'FAVORITED',
      },
      include: {
        eData: true,
      },
    });

    const userFavorites = await db.eInteraction.findMany({
      where: {
        userId: profileUser.userId,
        interactionType: 'FAVORITED',
      },
      include: {
        eData: true,
      },
    });

    const favorites = allFavorites.filter((favorite) => {
      return userFavorites.some(
        (userFavorite) => userFavorite.eData.id === favorite.dataId
      );
    });

    return favorites;
  };

  const getSaves = async () => {
    const allSaves = await db.eInteractionData.findMany({
      where: {
        interactionType: 'SAVED',
      },
      include: {
        eData: true,
      },
    });

    const userSaves = await db.eInteraction.findMany({
      where: {
        userId: profileUser.userId,
        interactionType: 'SAVED',
      },
      include: {
        eData: true,
      },
    });

    const saves = allSaves.filter((save) => {
      return userSaves.some((userSave) => userSave.eData.id === save.dataId);
    });

    return saves;
  };

  const getReviews = async () => {
    const allReviews = await db.eInteractionData.findMany({
      where: {
        interactionType: 'REVIEWED',
      },
      include: {
        eData: true,
      },
    });

    const userReviews = await db.eInteraction.findMany({
      where: {
        userId: profileUser.userId,
        interactionType: 'REVIEWED',
      },
      include: {
        eData: true,
      },
    });

    const reviews = allReviews.filter((review) => {
      return userReviews.some(
        (userReview) => userReview.eData.id === review.dataId
      );
    });

    return reviews;
  };

  const getRatings = async () => {
    const allRatings = await db.eInteractionData.findMany({
      where: {
        interactionType: 'RATED',
      },
      include: {
        eData: true,
      },
    });

    const userRatings = await db.eInteraction.findMany({
      where: {
        userId: profileUser.userId,
        interactionType: 'RATED',
      },
      include: {
        eData: true,
      },
    });

    const ratings = allRatings.filter((rating) => {
      return userRatings.some(
        (userRating) => userRating.eData.id === rating.dataId
      );
    });

    let sum = 0;

    ratings.map(({ rating }) => {
      sum += rating ?? 0;
    });

    return sum;
  };

  const counts = {
    saves: (await getSaves()).length,
    favorites: (await getFavorites()).length,
    reviews: (await getReviews()).length,
    followers: 0,
    following: 0,
    starsGiven: await getRatings(),
  };

  async function getUserFeed(): Promise<Interaction[]> {
    const allInteractions = await db.eInteractionData.findMany({
      include: {
        eData: true,
      },
    });

    const userInteractions = await db.eInteraction.findMany({
      where: {
        userId: profileUser?.userId,
      },
      include: {
        eData: true,
        user: true,
        eAlbum: true,
        eTrack: true,
      },
    });

    const interactions = allInteractions.filter((interaction) => {
      return userInteractions.some(
        (userInteraction) => userInteraction.eData.id === interaction.dataId
      );
    });

    const userFeed = userInteractions.map((interaction) => {
      const foundInteraction = interactions.find(
        (i) => i.dataId === interaction.eData.id
      );
      return {
        ...interaction,
        interactionData: foundInteraction ?? null,
      };
    });

    return userFeed;
  }

  const userFeed = await getUserFeed();

  return (
    <Suspense fallback={<Loading />}>
      <Window sessionId={sessionId || ''}>
        <div className='w-full md:h-full relative flex items-center justify-between md:justify-start flex-col md:gap-6 mt-20 md:mt-0 gap-5 overflow-y-auto overflow-clip scroll-smooth max-h-[calc(100vh)]'>
          <Suspense
            fallback={
              <Skeleton className='w-[200px] h-[400px] animate-pulse drop-shadow-2xl shadow-2xl bg-gray-600/40 rounded-lg' />
            }
          >
            <UserBox user={profileUser} counts={counts} />
          </Suspense>
          {/**
           * - Profile info
           * - Favorites
           * - Interactions
           * - ...
           */}
          <div className='md:absolute w-full flex flex-col items-center justify-center gap-2'>
            <Favorites interactionData={await getFavorites()} />
          </div>
          <div className='w-full flex items-center h-full mb-10'>
            <Suspense>
              <FeedList itemsPerPage={5}>
                {userFeed.map((item) => {
                  const interaction = {
                    ...item!,
                  };

                  const data = {
                    id: item?.dataId,
                    albumId: item?.albumId,
                    trackId: item?.trackId,
                  };

                  const interactionData = {
                    ...item?.interactionData,
                    id: item?.interactionData?.id!,
                    dataId: item?.interactionData?.dataId!,
                    createdAt: item?.interactionData?.createdAt!,
                    interactionType: item?.interactionData?.interactionType!,
                    updatedAt: item?.interactionData?.updatedAt!,
                    title: item?.interactionData?.title!,
                    targetUserId: item?.interactionData?.targetUserId ?? null,
                    imageUrl: item?.interactionData?.imageUrl ?? null,
                    artistName: item?.interactionData?.artistName ?? null,
                    albumName: item?.interactionData?.albumName ?? null,
                    rating: item?.interactionData?.rating ?? null,
                    review: item?.interactionData?.review ?? null,
                    albumId: item?.interactionData?.albumId ?? null,
                    trackId: item?.interactionData?.trackId ?? null,
                  };

                  const userData = item?.user;

                  return (
                    <Suspense
                      key={uuid()}
                      fallback={<FeedListItemSkeleton key={item?.user.id} />}
                    >
                      <FeedListItem key={item?.user.userId}>
                        {interaction && data && interactionData && userData ? (
                          <FeedItem
                            interaction={interaction}
                            // data={data}
                            interactionData={interactionData}
                            userId={userData.userId}
                            username={
                              userData.username ? userData.username : null
                            }
                          />
                        ) : null}
                      </FeedListItem>
                    </Suspense>
                  );
                })}
              </FeedList>
            </Suspense>
          </div>
        </div>
        <SavesGrid saves={await getSaves()} />
      </Window>
    </Suspense>
  );
}
