import {
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

  const existingTrack = await db.eTrack.findFirst({
    where: {
      trackId: interactionData.trackId,
    },
  });

  const existingInteraction = await db.eInteraction.findFirst({
    where: {
      userId,
      interactionType,
      eData: {
        interactionData: {
          ...interactionData,
        },
      },
    },
    include: {
      eData: {
        include: {
          interactionData: true,
        },
      },
      eAlbum: true,
      eTrack: true,
      user: true,
    },
  });

  if (existingInteraction && existingInteraction.eData && existingInteraction.eData.interactionData) {
    // If the interaction already exists, we can choose to update it or ignore it
    // For this example, we'll just return early
    return {
      ...existingInteraction,
      interactionData: {
        ...existingInteraction.eData.interactionData,
        ...interactionData,
      },
    };
  }

  // Create a new interaction

  // check for existing data
  const existingData = await db.eData.findFirst({
    where: {
      sessionId,
      interactionData: {
        ...interactionData,
      },
    },
    include: {
      interactionData: true,
    },
  });
  // IF EXISTING DATA
  const { albumId, trackId, title, artistName, albumName, imageUrl } = interactionData;

  if (existingData) {
    const interaction = await db.eInteraction.create({
      data: {
        interactionType,
        dataId: existingData.id,
        userId,
        trackId,
        albumId,
      },
      include: {
        eAlbum: true,
        eData: {
          include: {
            interactionData: true,
          },
        },
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
  } else {

    // If the data doesn't exist, create it
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
      include: {
        interactionData: true,
      },
    });

    // Create the interaction with the new data
    const interaction = await db.eInteraction.create({
      data: {
        interactionType,
        userId,
        dataId: newData.id,
      },
      include: {
        eAlbum: true,
        eData: {
          include: {
            interactionData: true,
          },
        },
        eTrack: true,
        user: true,
      },
    });



    // Create the album and track if they don't exist
    if (albumId && trackId && title && artistName && albumName && imageUrl) {
      if (!existingTrack) {
        await db.eTrack.create({
          data: {
            trackId,
            title,
            artistName,
            albumName,
            imageUrl,
            album: {
              connectOrCreate: {
                where: {
                  albumId,
                },
                create: {
                  albumId,
                  title: albumName,
                  artistName,
                  imageUrl,
                }
              }
            },
            eData: {
              connectOrCreate: {
                where: {
                  id: newData.id,
                },
                create: {
                  sessionId,
                  interactionData: {
                    create: {
                      interactionType,
                      ...interactionData,
                    }
                  }
                }
              }
            }
          }
        });
      }
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
};
