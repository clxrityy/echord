import { Album } from '@/components/categories/data';
import { Window } from '@/components/layout';
import { connection } from 'next/server';
import { Suspense } from 'react';
import Loading from '@/app/loading';
import { db, getUserSessionId } from '@/lib';

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
        <Album album={album} />
      </Window>
    </Suspense>
  );
}
