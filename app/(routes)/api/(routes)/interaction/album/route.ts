import { checkAlbumFromInteraction } from '@/app/_actions';
import { db } from '@/lib';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { id } = await req.json();

  const existingData = await checkAlbumFromInteraction(id);

  const album = await db.eAlbum.findFirst({
    where: {
      albumId: existingData?.albumId ?? id,
    },
  });

  if (!album) {
    return NextResponse.json(
      {
        error: 'Album not found',
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      album: {
        ...album,
        imageUrl: album.imageUrl,
        title: album.title,
        artistName: album.artistName,
      },
    },
    { status: 200 }
  );
}
