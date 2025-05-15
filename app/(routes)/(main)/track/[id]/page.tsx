import { getUserBySessionId } from '@/app/_actions';
import Loading from '@/app/loading';
import { Interact } from '@/components/categories/interactions';
import { Window } from '@/components/layout';
import { ImageComponent } from '@/components/ui';
import { db, getUserSessionId } from '@/lib';
import { EInteraction, EInteractionType, EUser } from '@/prisma/app/generated/prisma/client';
import { Interaction } from '@/types';
import { connection } from 'next/server';
import { Suspense } from 'react';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = 'force-dynamic'; // Force dynamic rendering

export default async function Page({ params }: Props) {
  await connection();

  const sessionId = await getUserSessionId();
  const id = (await params).id;

  const user = await getUserBySessionId(sessionId ?? '');
  const userId = user?.userId;

  const track = await db.eTrack.findUnique({
    where: {
      trackId: id,
    },
  });

  if (!track) {
    return <h1 className=''>Track not found</h1>;
  }

  const getInteractions = async () => {
    const allInteractions = await db.eInteractionData.findMany({
      where: {
        trackId: id,
      },
      include: {
        eData: true,
      }
    });

    const trackInteractions = await db.eInteraction.findMany({
      where: {
        trackId: id,
      }
    });

    const interactions = allInteractions.filter((interaction) => {
      return trackInteractions.some(
        (trackInteraction) => trackInteraction.dataId === interaction.eData.id
      );
    });

    return interactions;
  }

  const interactions = await getInteractions();

  const favorites = interactions.filter((interaction) => {
    return interaction.interactionType === EInteractionType.FAVORITED;
  }).length;
  const saves = interactions.filter((interaction) => {
    return interaction.interactionType === EInteractionType.SAVED;
  }).length;
  const reviews = interactions.filter((interaction) => {
    return interaction.interactionType === EInteractionType.REVIEWED;
  }).length;
  const ratings = interactions.filter((interaction) => {
    return interaction.interactionType === EInteractionType.RATED;
  }).length;

  async function getUserInteractions(): Promise<Interaction[]> {
    const allInteractionDatas = await db.eInteractionData.findMany({
      include: {
        eData: true,
      }
    });

    const allInteractions = await db.eInteraction.findMany({
      include: {
        eAlbum: true,
        eTrack: true,
        user: true,
      }
    });

    const interactions: Interaction[] = allInteractions.filter((interaction) => {
      return allInteractionDatas.some(
        (interactionData) => interactionData.eData.id === interaction.dataId
      );
    }).map((interaction) => ({
      ...interaction as EInteraction,
      eAlbum: interaction.eAlbum ? { ...interaction.eAlbum } : null,
      eTrack: interaction.eTrack ? { ...interaction.eTrack } : null,
      user: interaction.user ? { ...interaction.user as EUser } : null,
      interactionData: allInteractionDatas.find(
        (data) => data.eData.id === interaction.dataId
      ) || null
    })) as Interaction[];
    let array: Interaction[] = [];

    interactions.map((interaction) => {
      if (interaction?.userId === userId) {
        array.push(interaction);
      }
    })

    return array;
  }

  // Await the result
  const userInteractions = await getUserInteractions();

  // ...existing code...

  return (
    <Suspense fallback={<Loading />}>
      <Window sessionId={sessionId || ''}>
        <div className='w-full mx-auto flex flex-col md:flex-row md:items-start items-center justify-between gap-10 px-6 py-10'>
          <div className='flex flex-col items-center justify-center gap-5'>
            <div className='flex flex-col lg:flex-row items-center justify-center gap-6'>
              <div className='flex flex-col items-center justify-center gap-2'>
                {track.imageUrl && (
                  <ImageComponent
                    crossOrigin='anonymous'
                    src={track.imageUrl}
                    alt={track.title}
                    className='rounded-lg'
                    width={100}
                    height={100}
                    loading='eager'
                    priority
                    placeholder='blur'
                    blurDataURL={track.imageUrl}
                    quality={100}
                  />
                )}
                <h4>
                  {track.albumName}
                </h4>
              </div>
              <div className='flex flex-col gap-3 items-center justify-center'>
                <h2>
                  {track.title}
                </h2>
                <p>
                  {track.artistName}
                </p>
              </div>
            </div>
            <div className='flex flex-col items-center justify-center gap-3 py-8'>
              {
                userId && <Interact
                  userId={userId}
                  trackId={id}
                  initialInteractions={userInteractions}
                />
              }
            </div>
          </div>
          <div className='flex flex-col items-center md:items-start justify-center gap-5 w-full md:w-auto'>
            <div className='flex flex-col items-start justify-start gap-2'>
              <div className='flex flex-col items-start justify-start gap-2'>
                <p>
                  {favorites} Favorites
                </p>
                <p>
                  {saves} Saves
                </p>
                <p>
                  {reviews} Reviews
                </p>
                <p>
                  {ratings} Ratings
                </p>
              </div>
            </div>
          </div>
        </div>
      </Window>
    </Suspense>
  );
}
