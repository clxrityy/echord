import { db } from "@/lib/db";

export type DeleteInteractionProps = {
  userId: string;
  interactionId: string;
}

export async function deleteInteraction(
  { userId, interactionId }: DeleteInteractionProps
) {
  const existing = await db.eInteraction.findFirst({
    where: {
      dataId: interactionId,
      userId: userId,
    }
  });

  if (!existing) {
    throw new Error("Interaction not found");
  }

  try {
    await db.eInteraction.delete({
      where: {
        id: existing.id,
      },
    });
  } catch (e) {
    console.error("Error deleting interaction:", e);
    throw new Error("Failed to delete interaction");
  }
}
