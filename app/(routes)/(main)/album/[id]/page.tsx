import { Window } from '@/components/layout';
import { connection } from 'next/server';
import { Suspense } from 'react';
import Loading from '@/app/loading';
import { db, getUserSessionId } from '@/lib';
import { ImageComponent } from '@/components/ui';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  await connection();
  const sessionId = await getUserSessionId();

  const id = (await params).id;

  const album = await db.eAlbum.findUnique({
    where: {
      albumId: id,
    },
  });

  if (!album) {
    return <h1 className=''>Album not found</h1>;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Window sessionId={sessionId || ''}>
        {' '}
        <div className='w-full h-full mx-auto flex items-center justify-start'>
          <div className='flex flex-col w-full h-full mx-auto gap-6 items-center justify-center'>
            <h2>Album</h2>
            <div className='flex flex-col w-full h-full mx-auto gap-6 items-center justify-center'>
              <div className='flex flex-row w-full h-full mx-auto gap-6 items-center justify-center'>
                {
                  album.imageUrl && (
                    <ImageComponent
                      src={album.imageUrl}
                      alt={album.title}
                      className='w-full h-full object-cover rounded-lg'
                      width={500}
                      height={500}
                      priority
                      loading='eager'
                      placeholder='blur'
                      blurDataURL={album.imageUrl}
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      quality={100}
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  )
                }
                <h2 className='text-2xl font-bold'>{album.title}</h2>
              </div>
            </div>
          </div>
        </div>
      </Window>
    </Suspense>
  );
}
