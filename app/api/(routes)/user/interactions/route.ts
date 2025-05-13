import { db } from '@/lib';
import { Interaction } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { message: 'User ID is required' },
      { status: 400 }
    );
  }

  const userInteractions = await db.eInteraction.findMany({
    where: {
      userId: userId,
    },
    include: {
      user: true,
      eAlbum: true,
      eData: true,
      eTrack: true,
    },
  });

  if (!userInteractions) {
    return NextResponse.json(
      {
        message: 'No interactions found',
      },
      { status: 404 }
    );
  }

  const interactionDatas = await db.eInteractionData.findMany({
    include: {
      eData: true,
    },
  });

  const interactions: Interaction[] = [];

  interactionDatas.map((data, idx) => {
    if (userInteractions[idx] && data.dataId === userInteractions[idx].dataId) {
      interactions.push({
        ...userInteractions[idx],
        interactionData: {
          ...data,
        },
      });
    }
  });

  if (interactions.length > 0) {
    return NextResponse.json(
      {
        interactions: interactions,
      },
      {
        status: 200,
      }
    );
  } else {
    return NextResponse.json(
      {
        message: 'No interactions found',
      },
      {
        status: 404,
      }
    );
  }
}
