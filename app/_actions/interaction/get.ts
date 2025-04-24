import { db } from '@/lib';
import { Interaction } from '@/types';
import { EInteractionType } from '@/prisma/app/generated/prisma/client';

export async function getInteraction({
  dataId,
  userId,
  interactionType,
}: {
  dataId: string;
  userId: string;
  interactionType: EInteractionType;
}): Promise<Interaction | null> {
  const isMulitpleOrExisting = await db.eInteraction.findMany({
    where: {
      dataId,
      userId,
      interactionType,
    },
    include: {
      user: true,
      eAlbum: true,
      eData: true,
      eTrack: true,
    },
  });

  if (isMulitpleOrExisting.length > 1) {
    isMulitpleOrExisting.forEach(async (data, idx) => {
      if (idx > 0) {
        await db.eInteraction.delete({
          where: {
            id: data.id,
          },
        });
      }
    });

    const interactionData = await db.eInteractionData.findMany({
      where: {
        dataId: isMulitpleOrExisting[0].dataId,
      },
    });

    if (interactionData.length > 1) {
      interactionData.forEach(async (data, idx) => {
        if (idx > 0) {
          await db.eInteractionData.delete({
            where: {
              id: data.id,
            },
          });
        }
      });
    }

    const eData = await db.eData.findMany({
      where: {
        id: isMulitpleOrExisting[0].dataId,
      },
    });

    if (eData.length > 1) {
      eData.forEach(async (data, idx) => {
        if (idx > 0) {
          await db.eData.delete({
            where: {
              id: data.id,
            },
          });
        }
      });
    }

    return {
      ...isMulitpleOrExisting[0],
      interactionData: interactionData[0],
    };
  }

  const interaction = await db.eInteraction.findFirst({
    where: {
      dataId,
      userId,
      interactionType,
    },
    include: {
      user: true,
      eAlbum: true,
      eData: true,
      eTrack: true,
    },
  });

  if (!interaction) {
    return null;
  }

  const interactionData = await db.eInteractionData.findFirst({
    where: {
      dataId: interaction.dataId,
    },
  });

  return {
    ...interaction,
    interactionData: interactionData,
  };
}
