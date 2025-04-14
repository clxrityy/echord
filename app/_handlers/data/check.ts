import { db } from "@/lib/db";

export async function checkAlbumFromInteraction(id: string) {

  const album = await db.eAlbum.findFirst({
    where: {
      albumId: id
    }
  });

  if (album) {
    return album;
  }

  const interaction = await db.eInteraction.findFirst({
    where: {
      dataId: id
    }
  });

  if (!interaction) {
    const data = await db.eData.findFirst({
      where: {
        albumId: id
      }
    });

    if (!data) {
      const interactionData = await db.eInteractionData.findFirst({
        where: {
          albumId: id
        },
      })

      if (!interactionData) {
        return null;
      }

      return await db.eAlbum.create({
        data: {
          albumId: id,
          title: interactionData.title!,
          artistName: interactionData.artistName!,
          imageUrl: interactionData.imageUrl,
          updatedAt: new Date(),
        }
      })
    }

    return data;
  }

  return interaction;
}
