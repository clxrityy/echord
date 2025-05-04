import { db } from '@/lib/db';
import { fetchIp } from '@/util';
import { v4 as uuidv4 } from 'uuid';

export async function createSession(userId: string) {
  const ip = await fetchIp();

  if (!ip) {
    throw new Error('Failed to fetch IP');
  }

  const sessionId = uuidv4();

  const existingSessions = await db.eSession.findMany({
    where: {
      userId,
    },
  });

  if (existingSessions.length >= 0) {
    const ipAddresses = existingSessions[0].ipAddresses;

    if (!ipAddresses.includes(ip)) {
      ipAddresses.push(ip);
    }

    try {
      await db.eSession.deleteMany({
        where: {
          userId,
        },
      });

      const newSesh = await db.eSession.create({
        data: {
          sessionId,
          ipAddresses,
          userId,
        },
      });

      return newSesh;
    } catch (e) {
      console.error('Error creating session:', e);
      throw new Error('Database error');
    }
  }

  try {
    const newSession = await db.eSession.create({
      data: {
        sessionId,
        ipAddresses: [ip],
        userId,
      },
    });
    return newSession;
  } catch (e) {
    console.error('Error creating session:', e);
    throw new Error('Database error');
  }
}
