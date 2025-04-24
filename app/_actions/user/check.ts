import { db } from '@/lib';
import { EInteractionType } from '@/prisma/app/generated/prisma/client';
import { Interaction } from '@/types';

export async function checkUserSaves(
  userId: string,
  trackId: string
): Promise<Interaction | null> {
  const existing = await db.eInteraction.findFirst({
    where: {
      userId: userId,
      trackId: trackId,
      interactionType: EInteractionType.SAVED,
    },
    include: {
      eTrack: true,
      eAlbum: true,
      eData: true,
      user: true,
    },
  });

  if (existing) {
    const interactionData = await db.eInteractionData.findFirst({
      where: {
        trackId: existing.trackId,
        dataId: existing.eData.id,
      },
    });

    if (!interactionData) {
      return null;
    }

    const interaction: Interaction = {
      ...existing,
      interactionData: {
        ...interactionData,
      },
    };

    return interaction;
  } else {
    return null;
  }
}

export async function checkUserFavorites(
  userId: string,
  trackId: string
): Promise<Interaction | null> {
  const existing = await db.eInteraction.findFirst({
    where: {
      userId: userId,
      trackId: trackId,
      interactionType: EInteractionType.FAVORITED,
    },
    include: {
      eTrack: true,
      eAlbum: true,
      eData: true,
      user: true,
    },
  });

  if (existing) {
    const interactionData = await db.eInteractionData.findFirst({
      where: {
        trackId: existing.trackId,
        dataId: existing.eData.id,
      },
    });

    if (!interactionData) {
      return null;
    }

    const interaction: Interaction = {
      ...existing,
      interactionData: {
        ...interactionData,
      },
    };

    return interaction;
  } else {
    return null;
  }
}
