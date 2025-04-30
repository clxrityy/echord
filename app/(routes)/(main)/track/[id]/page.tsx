import Loading from '@/app/loading';
import { Window } from '@/components/layout';
import { ImageComponent } from '@/components/ui';
import { db, getUserSessionId } from '@/lib';
import { connection } from 'next/server';
import { Suspense } from 'react';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  await connection();

  const sessionId = await getUserSessionId();
  const id = (await params).id;

  const track = await db.eTrack.findUnique({
    where: {
      trackId: id,
    },
  });

  if (!track) {
    return <h1 className=''>Track not found</h1>;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Window sessionId={sessionId || ''}>
        <div className='w-full h-full mx-auto flex items-center justify-start'>
          <div className='flex flex-col w-full h-full mx-auto gap-6 items-center justify-center'>
            <h2>Track</h2>
            <div className='flex flex-col w-full h-full mx-auto gap-6 items-center justify-center'>
              <div className='flex flex-row w-full h-full mx-auto gap-6 items-center justify-center'>
                {track.imageUrl && (
                  <ImageComponent
                    src={track.imageUrl}
                    alt={track.title}
                    className='rounded-lg'
                    width={50}
                    height={50}
                    loading='eager'
                    priority
                    placeholder='blur'
                    blurDataURL={track.imageUrl}
                    quality={100}
                  />
                )}
                <h2 className='text-2xl font-bold'>{track.title}</h2>
              </div>
              <div className='flex flex-col w-full h-full mx-auto gap-6 items-center justify-center'>
                <h2 className='text-2xl font-bold'>{track.artistName}</h2>
                <h2 className='text-2xl font-bold'>{track.albumName}</h2>
              </div>
            </div>
          </div>
        </div>
      </Window>
    </Suspense>
  );
}
