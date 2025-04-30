import { Suspense } from 'react';
import { SavesGrid, Favorites, UserBox } from '@/components/categories/user';
import { Window } from '@/components/layout';
import Loading from '@/app/loading';
import { db, getUserSessionId } from '@/lib';
import { getUserBySessionId } from '@/app/_actions';
import { SettingsModal } from '@/components/categories/modals';
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
  const user = await getUserBySessionId(sessionId || '');
  const isCurrentUser = user?.userId === profileUser?.userId;

  if (!profileUser) {
    return <h1 className='mt-30'>User not found</h1>;
  }

  const getFavorites = async () => {

    const allFavorites = await db.eInteractionData.findMany({
      where: {
        interactionType: 'FAVORITED',
      }
    })

    const userFavorites = await db.eInteraction.findMany({
      where: {
        userId: profileUser.userId,
        interactionType: 'FAVORITED',
      },
    });

    const favorites = allFavorites.filter((favorite) => {
      return userFavorites.some((userFavorite) => userFavorite.dataId === favorite.dataId);
    })

    return favorites;
  };

  const getSaves = async () => {

    const allSaves = await db.eInteractionData.findMany({
      where: {
        interactionType: 'SAVED',
      }
    })

    const userSaves = await db.eInteraction.findMany({
      where: {
        userId: profileUser.userId,
        interactionType: 'SAVED',
      },
    });

    const saves = allSaves.filter((save) => {
      return userSaves.some((userSave) => userSave.dataId === save.dataId);
    })

    return saves;
  };

  const getReviews = async () => {

    const allReviews = await db.eInteractionData.findMany({
      where: {
        interactionType: 'REVIEWED',
      }
    })

    const userReviews = await db.eInteraction.findMany({
      where: {
        userId: profileUser.userId,
        interactionType: 'REVIEWED',
      },
    });

    const reviews = allReviews.filter((review) => {
      return userReviews.some((userReview) => userReview.dataId === review.dataId);
    })

    return reviews;
  }


  const counts = {
    saves: (await getSaves()).length,
    favorites: (await getFavorites()).length,
    reviews: (await getReviews()).length,
    followers: 0,
    following: 0,
  }

  return (
    <Suspense fallback={<Loading />}>
      <Window sessionId={sessionId || ''}>
        <div className='w-full h-full relative'>
          <Suspense fallback={<Skeleton className='w-[200px] h-[400px] animate-pulse drop-shadow-2xl shadow-2xl bg-gray-600/40 rounded-lg' />}>
            <UserBox user={profileUser} counts={counts} />
          </Suspense>
          <div className='flex items-center justify-center gap-2 w-fit'>
            {/* <h1 className='text-2xl font-bold'>{profileUser.username}</h1>
            {isCurrentUser && (
              <Suspense>
                <SettingsModal userId={profileUser.userId} />
              </Suspense>
            )} */}
            {/**
             * - Profile data (bio, etc.)
             */}
          </div>
          {/**
           * - Profile info
           * - Favorites
           * - Interactions
           * - ...
           */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Favorites interactionData={await getFavorites()} />
          </div>
        </div>
        <SavesGrid saves={await getSaves()} />
      </Window>
    </Suspense>
  );
}
