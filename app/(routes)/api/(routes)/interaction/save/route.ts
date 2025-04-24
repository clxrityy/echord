// import { EDataType } from "@/prisma/app/generated/prisma/client";
import {
  checkTrackFromInteraction,
  checkUserSaves,
  getTrack,
  handleInteraction,
} from '@/app/_actions';
import { db, getUserSessionId } from '@/lib';
import {
  EDataType,
  EInteractionType,
} from '@/prisma/app/generated/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { userId, dataId } = (await req.json()) as {
    userId: string;
    dataId: string;
    // dataType: EDataType;
  };

  const sessionId = await getUserSessionId();

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session expired. Please log in again.' },
      { status: 401 }
    );
  }

  if (!userId || !dataId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const exisingSave = await checkUserSaves(userId, dataId);

  if (exisingSave) {
    return NextResponse.json(
      { error: 'User already saved this track' },
      { status: 400 }
    );
  }

  const track = await getTrack(dataId);

  if (!track) {
    return NextResponse.json({ error: 'Track not found' }, { status: 404 });
  }

  const existingTrackData = await checkTrackFromInteraction(String(track.id));

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
        },
        interactionType: EInteractionType.SAVED,
        userId,
        sessionId: existingData.sessionId,
      });

      if (interaction) {
        return NextResponse.json(
          { message: 'Track saved successfully' },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: 'Failed to save track' },
          { status: 500 }
        );
      }
    } else {
      const interaction = await handleInteraction({
        dataType: EDataType.TRACK,
        interactionType: EInteractionType.SAVED,
        userId,
        sessionId,
        interactionData: {
          trackId: track.id.toString(),
          albumName: track.album.title,
          artistName: track.artist.name,
          title: track.title,
          imageUrl: track.album.cover_medium,
        },
      });

      if (interaction) {
        return NextResponse.json(
          {
            interaction: interaction,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: 'Failed to handle interaction' },
          { status: 500 }
        );
      }
    }
  } else {
    const interaction = await handleInteraction({
      dataType: EDataType.TRACK,
      interactionType: EInteractionType.SAVED,
      userId,
      sessionId,
      interactionData: {
        trackId: track.id.toString(),
        albumName: track.album.title,
        artistName: track.artist.name,
        title: track.title,
        imageUrl: track.album.cover_medium,
      },
    });

    if (interaction) {
      return NextResponse.json({ interaction: interaction }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: 'Failed to save track' },
        { status: 500 }
      );
    }
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
      userId,
      trackId,
      interactionType: EInteractionType.SAVED,
    },
  });

  if (!interaction) {
    return NextResponse.json({ interaction: null }, { status: 200 });
  }

  return NextResponse.json({ interaction }, { status: 200 });
}
