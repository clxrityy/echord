import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { encrypt, fetchIp } from '@/utils';
import { EUser } from '@/prisma/app/generated/prisma/client';
import { getUserSession, logoutUserSession } from '@/lib';

export async function createUser(
  username: string,
  pass: string
): Promise<EUser | undefined> {
  const existingUser = await getUserSession();

  const newUserId = uuidv4();
  const sessionId = uuidv4();

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
      return dbUser;
    }

    try {
      await logoutUserSession();

      await db.eUser.deleteMany({
        where: {
          session: {
            sessionId: sessionId,
          },
        },
      });

      const usr = await db.eUser.create({
        data: {
          userId: newUserId,
          username: username,
          password: encrypt(pass),
          session: {
            connectOrCreate: {
              where: {
                sessionId: sessionId,
              },
              create: {
                sessionId: sessionId,
                ipAddresses: [await fetchIp()],
              },
            },
          },
        },
      });

      return usr;
    } catch (e) {
      console.error('Error creating user:', e);
      throw new Error('Database error');
    }
  }

  try {
    const user = await db.eUser.create({
      data: {
        userId: uuidv4(),
        username: username,
        password: encrypt(pass),
        session: {
          connectOrCreate: {
            where: {
              sessionId: sessionId,
            },
            create: {
              sessionId: sessionId,
              ipAddresses: [await fetchIp()],
            },
          },
        },
      },
    });
    return user;
  } catch (e) {
    console.error('Error creating user:', e);
    throw new Error('Database error');
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

export async function getUserBySessionId(
  sessionId: string
): Promise<EUser | null> {
  try {
    const session = await db.eSession.findFirst({
      where: {
        sessionId: sessionId,
      },
      include: {
        EUser: true,
      },
    });

    if (session && session.EUser) {
      return session.EUser;
    } else {
      return null;
    }
  } catch (e) {
    console.error('Error getting user by session ID:', e);
    throw new Error('Database error');
  }
}
