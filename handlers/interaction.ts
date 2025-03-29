import { EDataType, EInteraction, EInteractionType } from '@prisma/client';
import { db } from '@/lib/db';

export interface InteractionProps {
  dataType: EDataType;
  data: { [key: string]: any };
  interactionType: EInteractionType;
  userId: string;
  sessionId: string;
}

export async function handleInteraction({
  dataType,
  data,
  interactionType,
  userId,
  sessionId,
}: InteractionProps): Promise<EInteraction | undefined> {
  try {
    const existingInteraction = await db.eInteraction.findFirst({
      where: {
        userId,
        dataType,
        type: interactionType,
        data: {
          ...data,
        },
      },
    });

    if (existingInteraction) {
      // If the interaction already exists, we can choose to update it or ignore it
      // For this example, we'll just return early
      return existingInteraction;
    }

    // Create a new interaction

    // check for existing data
    const existingData = await db.eData.findFirst({
      where: {
        type: dataType,
        data: {
          ...data,
        },
      },
    });

    if (!existingData) {
      // If the data doesn't exist, create it
      const newData = await db.eData.create({
        data: {
          type: dataType,
          data: {
            ...data,
          },
          session: {
            connectOrCreate: {
              where: {
                userId,
                sessionId,
              },
              create: {
                userId,
                sessionId,
              },
            },
          },
        },
      });

      // Create the interaction with the new data
      return await db.eInteraction.create({
        data: {
          type: interactionType,
          dataId: newData.id,
          userId,
          dataType,
        },
      });
    }
  } catch (e) {
    console.error('Error handling interaction:', e);
    throw new Error('Failed to handle interaction');
  }
}
