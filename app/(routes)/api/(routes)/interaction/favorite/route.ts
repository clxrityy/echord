import {
  checkTrackFromInteraction,
  checkUserFavorites,
  getTrack,
  handleInteraction,
} from '@/app/_actions';
import { db, getUserSessionId } from '@/lib';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { userId, trackId } = (await req.json()) as {
    userId: string;
    trackId: string;
  };

  const sessionId = await getUserSessionId();

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session expired. Please log in again.' },
      { status: 401 }
    );
  }

  if (!userId || !trackId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const existingFavorite = await checkUserFavorites(userId, trackId);

  if (existingFavorite) {
    return NextResponse.json(
      { error: 'User already favorited this track' },
      { status: 400 }
    );
  }

  const track = await getTrack(trackId);

  if (!track) {
    return NextResponse.json({ error: 'Track not found' }, { status: 404 });
  }

  const existingTrackData = await checkTrackFromInteraction(trackId);

  if (existingTrackData) {
    const existingData = await db.eData.findFirst({
      where: {
        trackId: existingTrackData.trackId,
        interactionData: {
          trackId: existingTrackData.trackId,
        },
      },
      include: {
        eTrack: true,
        eAlbum: true,
      },
    });

    if (existingData) {
      const interaction = await handleInteraction({
        dataType: existingData.dataType,
        interactionData: {
          ...existingData,
          ...existingTrackData,
        },
        interactionType: 'FAVORITED',
        userId,
        sessionId: existingData.sessionId,
      });

      if (!interaction) {
        return NextResponse.json(
          { error: 'Failed to create or update interaction' },
          { status: 500 }
        );
      }

      return NextResponse.json({ interaction }, { status: 200 });
    } else {
      const interaction = await handleInteraction({
        dataType: 'TRACK',
        interactionData: {
          trackId: track.id.toString(),
          title: track.title,
          artistName: track.artist.name,
          albumName: track.album.title,
          imageUrl: track.album.cover_medium,
        },
        interactionType: 'FAVORITED',
        userId,
        sessionId,
      });

      if (!interaction) {
        return NextResponse.json(
          { error: 'Failed to create interaction' },
          { status: 500 }
        );
      }

      return NextResponse.json({ interaction }, { status: 200 });
    }
  }

  try {
    await db.eTrack.create({
      data: {
        trackId: track.id.toString(),
        title: track.title,
        artistName: track.artist.name,
        albumName: track.album.title,
        imageUrl: track.album.cover_medium,
        album: {
          connectOrCreate: {
            where: {
              albumId: track.album.id.toString(),
            },
            create: {
              albumId: track.album.id.toString(),
              title: track.album.title,
              artistName: track.artist.name,
              imageUrl: track.album.cover_medium,
            },
          },
        },
      },
    });

    const interaction = await handleInteraction({
      dataType: 'TRACK',
      interactionData: {
        trackId: track.id.toString(),
        title: track.title,
        artistName: track.artist.name,
        albumName: track.album.title,
        imageUrl: track.album.cover_medium,
      },
      interactionType: 'FAVORITED',
      userId,
      sessionId,
    });

    if (!interaction) {
      return NextResponse.json(
        { error: 'Failed to create interaction' },
        { status: 500 }
      );
    }

    return NextResponse.json({ interaction }, { status: 200 });
  } catch (e) {
    console.error('Error creating track:', e);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const trackId = searchParams.get('trackId');
  const userId = searchParams.get('userId');

  if (!trackId || !userId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const interaction = await db.eInteraction.findFirst({
    where: {
      userId: userId,
      trackId: trackId,
      interactionType: 'FAVORITED',
    },
  });

  if (!interaction) {
    return NextResponse.json({ interaction: null }, { status: 200 });
  }

  return NextResponse.json({ interaction }, { status: 200 });
}
