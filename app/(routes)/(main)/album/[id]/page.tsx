import { Album } from '@/components/elements/data/Album';
import { Window } from '@/components/layout/screen/Window';
import { handleCurrentSession } from '@/app/_actions/session';
import { db } from '@/lib/db';
import { connection } from 'next/server';
import { Suspense } from 'react';
import Loading from '@/app/loading';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  await connection();

  const session = await handleCurrentSession();

  const id = (await params).id;

  const album = await db.eAlbum.findFirst({
    where: {
      albumId: id,
    },
  });

  if (!album) {
    return <h1 className=''>Album not found</h1>;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Window sessionId={session.sessionId || ''}>
        <Album album={album} />
      </Window>
    </Suspense>
  );
}
