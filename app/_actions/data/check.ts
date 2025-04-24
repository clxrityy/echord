import { db } from '@/lib/db';

export async function checkAlbumFromInteraction(id: string) {
  const album = await db.eAlbum.findFirst({
    where: {
      albumId: id,
    },
  });

  if (album) {
    return album;
  }

  const interaction = await db.eInteraction.findFirst({
    where: {
      albumId: id,
    },
  });

  if (!interaction) {
    const data = await db.eData.findFirst({
      where: {
        albumId: id,
      },
    });

    if (!data) {
      const interactionData = await db.eInteractionData.findFirst({
        where: {
          albumId: id,
        },
      });

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
        },
      });
    }

    const interactionData = await db.eInteractionData.findFirst({
      where: {
        albumId: id,
      },
    });

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
      },
    });
  }

  const interactionData = await db.eInteractionData.findFirst({
    where: {
      dataId: interaction.dataId,
    },
  });

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
    },
  });
}

export async function checkTrackFromInteraction(id: string) {
  const track = await db.eTrack.findFirst({
    where: {
      trackId: id,
    },
  });

  if (track) {
    return track;
  }

  const interaction = await db.eInteraction.findFirst({
    where: {
      trackId: id,
    },
  });

  if (!interaction) {
    const data = await db.eData.findFirst({
      where: {
        trackId: id,
      },
    });

    if (!data) {
      const interactionData = await db.eInteractionData.findFirst({
        where: {
          trackId: id,
        },
      });

      if (!interactionData) {
        return null;
      }

      return await db.eTrack.create({
        data: {
          trackId: id,
          title: interactionData.title!,
          artistName: interactionData.artistName!,
          imageUrl: interactionData.imageUrl,
          updatedAt: new Date(),
          albumName: interactionData.albumName!,
          album: {
            connectOrCreate: {
              where: {
                albumId: String(interactionData.albumId),
              },
              create: {
                albumId: String(interactionData.albumId),
                title: interactionData.albumName!,
                artistName: interactionData.artistName!,
                imageUrl: interactionData.imageUrl,
              },
            },
          },
        },
      });
    }

    const interactionData = await db.eInteractionData.findFirst({
      where: {
        dataId: id,
      },
    });

    if (!interactionData) {
      return null;
    }
  }

  const interactionData = await db.eInteractionData.findFirst({
    where: {
      trackId: id,
    },
  });

  if (!interactionData) {
    return null;
  }

  return await db.eTrack.create({
    data: {
      trackId: id,
      title: interactionData.title!,
      artistName: interactionData.artistName!,
      imageUrl: interactionData.imageUrl,
      updatedAt: new Date(),
      albumName: interactionData.albumName!,
      album: {
        connectOrCreate: {
          where: {
            albumId: String(interactionData.albumId),
          },
          create: {
            albumId: String(interactionData.albumId),
            title: interactionData.albumName!,
            artistName: interactionData.artistName!,
            imageUrl: interactionData.imageUrl,
          },
        },
      },
    },
  });
}
