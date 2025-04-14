import { Album } from '@/components/elements/data/Album';
import { Window } from '@/components/layout/screen/Window';
import Skeleton from '@/components/ui/Skeleton';
import { handleCurrentSession } from '@/app/_handlers/session';
import { db } from '@/lib/db';
import { connection } from 'next/server';
import { Suspense } from 'react';

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
    <Suspense fallback={<Skeleton className='w-full h-full' />}>
      <Window sessionId={session.sessionId || ''}>
        <Album album={album} />
      </Window>
    </Suspense>
  );
}
