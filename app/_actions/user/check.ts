import { db, getUserSession } from '@/lib';
import {
  EInteractionType,
  ESession,
  EUser,
} from '@/prisma/app/generated/prisma/client';
import { Interaction } from '@/types';
import { getUserBySessionId } from '.';
import { decrypt } from '@/utils';

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

export async function checkUser(
  username: string,
  sessionId: string
): Promise<string | undefined> {
  const existingUser = await getUserSession();

  if (existingUser) {
    const dbUser = await db.eUser.findFirst({
      where: {
        username: username,
        session: {
          sessionId: sessionId,
        },
      },
    });

    if (dbUser) {
      return dbUser.userId;
    }

    const user = await getUserBySessionId(sessionId);

    if (user) {
      await db.eUser.deleteMany({
        where: {
          session: {
            sessionId: sessionId,
          },
        },
      });
    }
  }

  const user = await db.eUser.findFirst({
    where: {
      username: username,
      session: {
        sessionId: sessionId,
      },
    },
  });

  if (!user) {
    return undefined;
  }
}

export async function checkUserByPasswordAndUsername(
  username: string,
  password: string
): Promise<(EUser & ESession) | null> {
  try {
    const usersWithUsername = await db.eUser.findMany({
      where: {
        username: username,
      },
      include: {
        session: true,
      },
    });

    if (usersWithUsername.length === 0) {
      return null;
    }

    const getUser = async () => {
      let matches: (EUser & { session: ESession | null })[] = [];
      usersWithUsername.forEach(async (user) => {
        if (decrypt(user.password) === password) {
          matches.push(user);
        }
      });

      if (matches.length === 1) {
        return matches[0];
      }

      if (matches.length > 1) {
        const handledMatch = await handleDuplicateUsers({
          username: username,
          password: password,
        });

        if (handledMatch) {
          matches.push(handledMatch);
        }

        return null;
      }

      if (matches[0]) {
        return matches[0];
      }
    };

    const user = await getUser();

    if (user && user.session) {
      return {
        ...user,
        ...user.session,
      };
    } else {
      return null;
    }
  } catch (e) {
    console.error('Error checking user by password and username:', e);
    throw new Error('Database error');
  }
}

export async function handleDuplicateUsers({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<
  | (EUser & {
      session: ESession | null;
    })
  | null
> {
  const usersWithSameUsername = await db.eUser.findMany({
    where: {
      username: username,
    },
    include: {
      session: true,
    },
  });

  if (usersWithSameUsername.length > 1) {
    const usersWithSamePassword = usersWithSameUsername.filter((user) => {
      return decrypt(user.password) === password;
    });

    if (usersWithSamePassword.length > 1) {
      const user = usersWithSamePassword[0];

      usersWithSamePassword.forEach(async (userData) => {
        if (userData.userId !== user.userId) {
          await db.eUser.delete({
            where: {
              userId: userData.userId,
            },
          });
        }
      });

      return user;
    }

    if (usersWithSamePassword.length === 1) {
      return usersWithSamePassword[0];
    }
    if (usersWithSamePassword.length === 0) {
      return null;
    }
  }

  if (
    usersWithSameUsername[0] &&
    usersWithSameUsername[0].username === username
  ) {
    const user = usersWithSameUsername[0];

    if (decrypt(user.password) === password) {
      return user;
    }
  }

  return null;
}
