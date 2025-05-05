import {
  EData,
  EInteractionData,
  EInteractionType,
} from '@/prisma/app/generated/prisma/client';
import { db } from '@/lib/db';
import { Interaction } from '@/types';

export interface InteractionProps {
  interactionData: Partial<EInteractionData> | EInteractionData;
  interactionType: EInteractionType;
  userId: string;
  sessionId: string;
}

export async function handleInteraction({
  interactionData,
  interactionType,
  userId,
  sessionId,
}: InteractionProps): Promise<Interaction | undefined> {
  if (!interactionData.trackId || !interactionData.albumId) {
    return undefined;
  }

  const existingTrack = await findExistingTrack(interactionData.trackId);
  const existingInteraction = await findExistingInteraction(
    userId,
    interactionType,
    interactionData
  );

  if (existingInteraction) {
    return await createInteractionWithExistingData(
      existingInteraction.eData,
      interactionType,
      userId,
      interactionData
    );
  }

  const existingData = await findExistingData(sessionId, interactionData);

  if (existingData) {
    return await createInteractionWithExistingData(
      existingData,
      interactionType,
      userId,
      interactionData
    );
  } else {
    return await createNewInteractionAndData(
      sessionId,
      interactionType,
      userId,
      interactionData,
      existingTrack
    );
  }
}

async function findExistingTrack(trackId: string) {
  return await db.eTrack.findFirst({
    where: { trackId },
  });
}

async function findExistingInteraction(
  userId: string,
  interactionType: EInteractionType,
  interactionData: Partial<EInteractionData>
) {
  return await db.eInteraction.findFirst({
    where: {
      userId,
      interactionType,
      eData: {
        interactionData: { ...interactionData },
      },
    },
    include: {
      eData: { include: { interactionData: true } },
      eAlbum: true,
      eTrack: true,
      user: true,
    },
  });
}

async function findExistingData(
  sessionId: string,
  interactionData: Partial<EInteractionData>
) {
  return await db.eData.findFirst({
    where: {
      sessionId,
      interactionData: { ...interactionData },
    },
    include: { interactionData: true },
  });
}

async function createInteractionWithExistingData(
  existingData: EData,
  interactionType: EInteractionType,
  userId: string,
  interactionData: Partial<EInteractionData>
) {
  const newData = await db.eData.create({
    data: {
      sessionId: existingData.sessionId,
      interactionData: {
        create: {
          interactionType,
          ...interactionData,
        },
      },
    },
    include: { interactionData: true },
  })

  const interaction = await db.eInteraction.create({
    data: {
      interactionType,
      dataId: newData.id,
      userId,
      trackId: interactionData.trackId,
      albumId: interactionData.albumId,
    },
    include: {
      eAlbum: true,
      eData: { include: { interactionData: true } },
      eTrack: true,
      user: true,
    },
  });

  if (interaction && interaction.eData.interactionData) {
    return {
      ...interaction,
      interactionData: {
        ...interaction.eData.interactionData,
        ...interactionData,
      },
    };
  }
}

async function createNewInteractionAndData(
  sessionId: string,
  interactionType: EInteractionType,
  userId: string,
  interactionData: Partial<EInteractionData>,
  existingTrack: any
) {
  const newData = await db.eData.create({
    data: {
      sessionId,
      interactionData: {
        create: {
          interactionType,
          ...interactionData,
        },
      },
    },
    include: { interactionData: true },
  });

  const interaction = await db.eInteraction.create({
    data: {
      interactionType,
      userId,
      albumId: interactionData.albumId,
      trackId: interactionData.trackId,
      dataId: newData.id,
    },
    include: {
      eAlbum: true,
      eData: { include: { interactionData: true } },
      eTrack: true,
      user: true,
    },
  });

  if (
    interactionData.albumId &&
    interactionData.trackId &&
    interactionData.title &&
    interactionData.artistName &&
    interactionData.albumName &&
    interactionData.imageUrl &&
    sessionId &&
    !existingTrack
  ) {
    await db.eTrack.create({
      data: {
        trackId: interactionData.trackId,
        title: interactionData.title,
        artistName: interactionData.artistName,
        albumName: interactionData.albumName,
        imageUrl: interactionData.imageUrl,
        album: {
          connectOrCreate: {
            where: { albumId: interactionData.albumId },
            create: {
              albumId: interactionData.albumId,
              title: interactionData.albumName,
              artistName: interactionData.artistName,
              imageUrl: interactionData.imageUrl,
            },
          },
        },
        eData: {
          connect: {
            id: newData.id,
            sessionId,
            interactionData: {
              interactionType,
            },
          },

        },
      },
    });
  }

  if (interaction && interaction.eData.interactionData) {
    return {
      ...interaction,
      interactionData: {
        ...interaction.eData.interactionData,
        ...newData.interactionData,
      },
    };
  } else {
    return null;
  }
}
