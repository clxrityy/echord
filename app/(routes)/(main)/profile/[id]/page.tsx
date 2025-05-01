import { Suspense } from 'react';
import { SavesGrid, Favorites, UserBox } from '@/components/categories/user';
import { Window } from '@/components/layout';
import Loading from '@/app/loading';
import { db, getUserSessionId } from '@/lib';
// import { getUserBySessionId } from '@/app/_actions';
import { Skeleton } from '@/components/ui';

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
  // const user = await getUserBySessionId(sessionId || '');
  // const isCurrentUser = user?.userId === profileUser?.userId;

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
      for (let i = 0; i < ratings.length; i++) {
        sum += rating ?? 0;
      }
    });

    return sum;
  }

  const counts = {
    saves: (await getSaves()).length,
    favorites: (await getFavorites()).length,
    reviews: (await getReviews()).length,
    followers: 0,
    following: 0,
    starsGiven: await getRatings(),
  };

  return (
    <Suspense fallback={<Loading />}>
      <Window sessionId={sessionId || ''}>
        <div className='w-full h-auto md:h-full relative flex items-center justify-start flex-col md:gap-6 mt-20 md:mt-0 gap-7'>
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
          <div className='md:absolute fixed top-75 md:top-25 right-[40%] md:right-5'>
            <Favorites interactionData={await getFavorites()} />
          </div>
        </div>
        <SavesGrid saves={await getSaves()} />
      </Window>
    </Suspense>
  );
}
