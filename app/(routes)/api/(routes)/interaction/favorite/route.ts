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
    return respondWithError('Session expired. Please log in again.', 401);
  }

  if (!userId || !trackId) {
    return respondWithError('Missing required fields', 400);
  }

  const track = await getTrack(trackId);

  if (!track) {
    return respondWithError('Track not found', 404);
  }

  if (await checkUserFavorites(userId, trackId)) {
    return respondWithError('User already favorited this track', 400);
  }

  const existingTrackData = await checkTrackFromInteraction(trackId);

  if (existingTrackData) {
    return handleExistingTrackData(existingTrackData, track, userId, sessionId);
  }

  return await createInteraction(track, userId, sessionId);
}

function respondWithError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

async function handleExistingTrackData(
  existingTrackData: any,
  track: any,
  userId: string,
  sessionId: string
) {
  const existingData = await db.eData.findFirst({
    where: {
      trackId: existingTrackData.trackId,
      interactionData: {
        trackId: existingTrackData.trackId || track.id.toString(),
        albumId: existingTrackData.albumId || track.album.id.toString(),
        title: track.title,
        artistName: track.artist.name,
        albumName: track.album.title,
      },
    },
    include: {
      eTrack: true,
      eAlbum: true,
    },
  });

  const interactionData = existingData
    ? { ...existingData, ...existingTrackData, imageUrl: track.album.cover_medium }
    : {
        trackId: track.id.toString(),
        title: track.title,
        artistName: track.artist.name,
        albumName: track.album.title,
        imageUrl: track.album.cover_medium,
      };

  return await createOrUpdateInteraction(interactionData, userId, sessionId);
}

async function createInteraction(track: any, userId: string, sessionId: string) {
  try {
    const interaction = await handleInteraction({
      interactionData: {
        trackId: track.id.toString(),
        title: track.title,
        artistName: track.artist.name,
        albumName: track.album.title,
        imageUrl: track.album.cover_medium,
        albumId: track.album.id.toString(),
      },
      interactionType: 'FAVORITED',
      userId,
      sessionId,
    });

    if (!interaction) {
      return respondWithError('Failed to create interaction', 500);
    }

    return NextResponse.json({ interaction }, { status: 200 });
  } catch (e) {
    console.error('Error creating track:', e);
    return respondWithError('Database error', 500);
  }
}

async function createOrUpdateInteraction(
  interactionData: any,
  userId: string,
  sessionId: string
) {
  const interaction = await handleInteraction({
    interactionData,
    interactionType: 'FAVORITED',
    userId,
    sessionId,
  });

  if (!interaction) {
    return respondWithError('Failed to create or update interaction', 500);
  }

  return NextResponse.json({ interaction }, { status: 200 });
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
