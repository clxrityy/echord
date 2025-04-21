import { Settings } from '@/components/elements/user/Settings';
import { Favorites } from '@/components/elements/user/Favorites';
import Skeleton from '@/components/ui/Skeleton';
import { Suspense } from 'react';
import { SavesGrid } from '@/components/elements/user/save/SavesGrid';
import { Window } from '@/components/layout/screen/Window';
import Loading from '@/app/loading';
import { db, getUserSessionId } from '@/lib';
import { getUserBySessionId } from '@/app/_actions/user';

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
      },
    });

    const userFavorites = await db.eInteraction.findMany({
      where: {
        userId: profileUser.userId,
        interactionType: 'FAVORITED',
      },
    });

    const favorites = allFavorites.filter((favorite) =>
      userFavorites.some(
        (userFavorite) => userFavorite.dataId === favorite.dataId
      )
    );

    return favorites;
  };

  const getSaves = async () => {
    const allSaves = await db.eInteractionData.findMany({
      where: {
        interactionType: 'SAVED',
      },
    });

    const userSaves = await db.eInteraction.findMany({
      where: {
        userId: profileUser.userId,
        interactionType: 'SAVED',
      },
    });

    const saves = allSaves.filter((save) =>
      userSaves.some((userSave) => userSave.dataId === save.dataId)
    );

    return saves;
  };

  return (
    <Suspense fallback={<Loading />}>
      <Window sessionId={sessionId || ''}>
        <div className='w-full flex flex-col gap-10 items-center justify-around'>
          <div className='flex items-center justify-start gap-2 w-fit'>
            {isCurrentUser && (
              <Suspense fallback={<Skeleton />}>
                <Settings
                // sessionId={session.sessionId}
                // userId={profileUser.userId}
                />
              </Suspense>
            )}
            <div className='flex flex-row items-center gap-2'>
              <h1 className='text-2xl font-bold'>{profileUser.username}</h1>
            </div>
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
