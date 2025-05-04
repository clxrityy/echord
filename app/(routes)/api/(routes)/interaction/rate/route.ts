import {
  checkTrackFromInteraction,
  getInteraction,
  getTrack,
  handleInteraction,
} from '@/app/_actions';
import { db, getUserSessionId } from '@/lib';
import { EInteractionType } from '@/prisma/app/generated/prisma/client';
import { average } from '@/util';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dataId = searchParams.get('dataId');
  const userId = searchParams.get('userId');

  if (!dataId || !userId)
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );

  try {
    const interaction = await getInteraction({
      dataId,
      userId,
      interactionType: 'RATED',
    });

    if (!interaction) {
      return NextResponse.json(
        { message: 'No interaction found' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        interaction,
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: 'Error fetching interaction',
        error: e,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  const sessionId = await getUserSessionId();

  if (!sessionId) {
    return NextResponse.json(
      {
        error: 'User not authenticated',
      },
      {
        status: 401,
      }
    );
  }

  const { trackId, userId, value } = (await req.json()) as {
    trackId: string;
    userId: string;
    value: number;
  };

  if (!trackId || !userId || !value)
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );

  const track = await getTrack(trackId);

  if (!track) {
    return NextResponse.json(
      {
        error: 'Track not found',
      },
      {
        status: 404,
      }
    );
  }

  const existingTrackData = await checkTrackFromInteraction(trackId);

  if (existingTrackData) {
    const existingData = await db.eData.findFirst({
      where: {
        trackId: existingTrackData.trackId,
        interactionData: {
          trackId: existingTrackData.trackId,
          albumName: track.album.title,
          artistName: track.artist.name,
          title: track.title,
          albumId: String(track.album.id),
        },
      },
      include: {
        eTrack: true,
        eAlbum: true,
      },
    });

    if (existingData) {
      const interaction = await handleInteraction({
        interactionData: {
          ...existingData,
          imageUrl: track.album.cover_medium,
          rating: value,
        },
        interactionType: EInteractionType.RATED,
        userId,
        sessionId: existingData.sessionId,
      });

      if (interaction) {
        return NextResponse.json(
          { message: 'Track rated successfully' },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: 'Failed to rate track' },
          { status: 500 }
        );
      }
    } else {
      const interaction = await handleInteraction({
        interactionType: EInteractionType.RATED,
        userId,
        sessionId,
        interactionData: {
          trackId: track.id.toString(),
          albumName: track.album.title,
          artistName: track.artist.name,
          title: track.title,
          imageUrl: track.album.cover_medium,
          albumId: String(track.album.id),
          rating: value,
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
      interactionType: EInteractionType.RATED,
      userId,
      sessionId,
      interactionData: {
        trackId: track.id.toString(),
        albumName: track.album.title,
        artistName: track.artist.name,
        title: track.title,
        albumId: String(track.album.id),
        imageUrl: track.album.cover_medium,
        rating: value,
      },
    });

    if (interaction) {
      const ratingsData = await db.eInteractionData.findMany({
        where: {
          interactionType: 'RATED',
          trackId: trackId,
        },
      });

      const ratingsMapped = ratingsData.map((rating) => rating.rating!);

      const averageRating = average(ratingsMapped);

      try {
        await db.eTrack.update({
          where: {
            trackId: trackId,
          },
          data: {
            averageRating,
          },
        });

        return NextResponse.json(
          {
            interaction,
          },
          {
            status: 200,
          }
        );
      } catch (e) {
        console.error('Error updating track rating:', e);
        return NextResponse.json(
          { error: 'Failed to update track rating', interaction },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Failed to rate track' },
        { status: 500 }
      );
    }
  }
}
