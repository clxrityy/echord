import { getUserBySessionId } from '@/app/_actions';
import { db } from '@/lib';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  const rawFeed = await db.eInteraction.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      interactionType: {
        notIn: ['UNFOLLOWED', 'FOLLOWED'],
      },
    },
  });

  const array = Array.from(rawFeed).map(async (item) => {
    const { ...interaction } = item;
    const { ...data } = await db.eData.findUnique({
      where: {
        id: item.dataId,
      },
    });

    const { ...interactionData } = await db.eInteractionData.findFirst({
      where: {
        dataId: item.dataId,
      },
    });

    const user = await getUserBySessionId(data.sessionId);

    return {
      interaction,
      data,
      interactionData,
      user,
    };
  });

  const feedItems = await Promise.all(array);

  return NextResponse.json(
    {
      feedItems: feedItems.map((item) => {
        const { interaction, data, interactionData, user } = item;

        return {
          interaction,
          data,
          interactionData,
          user,
        };
      }),
    },
    {
      status: 200,
    }
  );
}
