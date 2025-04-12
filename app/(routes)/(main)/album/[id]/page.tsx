import { db } from '@/lib/db';

type Props = {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({params}: Props) {

  const id = (await params).id;

  const album = await db.eAlbum.findFirst({
    where: {
      albumId: id,
    },
  });

  if (!album) {
    return <h1 className="">Album not found</h1>;
  }

  return (
    <div className="">
      <h1>
        {album.title} by {album.artistName}
      </h1>
    </div>
  )
}
