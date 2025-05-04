import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { encrypt, fetchIp } from '@/util';
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
