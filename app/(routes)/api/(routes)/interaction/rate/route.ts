import {
  checkTrackFromInteraction,
  getInteraction,
  getTrack,
  handleInteraction,
} from '@/app/_actions';
import { db, getUserSessionId } from '@/lib';
import { Interaction } from '@/types';
import { average } from '@/utils';
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

  const existingTrack = await checkTrackFromInteraction(trackId);

  let interaction: Interaction | undefined = undefined;
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

  if (!existingTrack) {

    await db.eTrack.create({
      data: {
        trackId: trackId,
        updatedAt: new Date(),
        albumName: track.album.title,
        releaseDate: new Date(track.release_date),
        eData: {
          create: {
            dataType: 'TRACK',
            interactionData: {
              create: {
                interactionType: 'RATED',
                imageUrl: track.album.cover_xl,
                title: track.title,
                artistName: track.artist.name,
                rating: value,
                albumName: track.album.title,
                albumId: String(track.album.id),
              },
            },
            interactions: {
              create: {
                interactionType: 'RATED',
                userId,
                trackId,
                dataType: 'TRACK',
              },
            },
            session: {
              connect: {
                userId,
                sessionId,
              },
            },
          },
        },
        album: {
          connectOrCreate: {
            where: {
              albumId: String(track.album.id),
            },
            create: {
              albumId: String(track.album.id),
              title: track.album.title,
              artistName: track.artist.name,
              imageUrl: track.album.cover_xl,
            },
          },
        },
        imageUrl: track.album.cover_xl,
        title: track.title,
        artistName: track.artist.name,
        averageRating: value,
      },
    });

    const interactionData = await db.eInteractionData.findFirst({
      where: {
        interactionType: 'RATED',
        trackId: trackId,
        eData: {
          sessionId: sessionId,
        }
      },
    });

    const interactionResponse = await db.eInteraction.findFirst({
      where: {
        trackId: trackId,
        interactionType: 'RATED',
        userId: userId,
      },
      include: {
        eData: true,
        user: true,
        eAlbum: true,
        eTrack: true,
      },
    });

    if (interactionData && interactionResponse) {
      interaction = {
        ...interactionResponse,
        interactionData: {
          ...interactionData,
        },
      };

      return NextResponse.json(
        {
          interaction,
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      {
        error: 'Unable to locate interaction data',
      },
      {
        status: 500,
      }
    );
  }

  interaction = await handleInteraction({
    dataType: 'TRACK',
    interactionType: 'RATED',
    userId,
    sessionId,
    interactionData: {
      trackId,
      imageUrl: track.album.cover_medium,
      title: track.title,
      artistName: track.artist.name,
      albumName: track.album.title,
      albumId: String(track.album.id),
      rating: value,
    }
  });

  if (!interaction) {
    return NextResponse.json(
      {
        error: 'Unable to locate interaction data',
      },
      {
        status: 500,
      }
    );
  }

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
        interaction
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: 'Error rating album',
        error: e,
      },
      {
        status: 500,
      }
    );
  }
}
