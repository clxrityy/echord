import { db } from '@/lib/db';
import { fetchIp } from '@/utils';
import { createSession } from './create';
import { getSessionByUserId } from './get';

export async function handleCurrentSession(userId?: string) {
  const ip = await fetchIp();
  if (!ip) {
    throw new Error('Failed to fetch IP');
  }

  if (userId) {
    const session = await getSessionByUserId(userId);

    if (session) {
      await appendSessionIpAddress(session.sessionId);
      return session;
    } else {
      return await createSession();
    }
  }

  try {
    const currentSession = await db.eSession.findFirst({
      where: {
        ipAddresses: {
          has: ip,
        },
      },
    });

    if (currentSession) {
      return currentSession;
    } else {
      return await createSession();
    }
  } catch (e) {
    console.error('Error fetching current session:', e);
    throw new Error('Database error');
  }
}

export async function appendSessionIpAddress(sessionId: string) {
  const ip = await fetchIp();

  if (!ip) {
    throw new Error('Failed to fetch IP');
  }

  try {
    const updatedSession = await db.eSession.update({
      where: {
        sessionId,
      },
      data: {
        ipAddresses: {
          push: ip,
        },
        updatedAt: new Date(),
      },
    });
    return updatedSession;
  } catch (e) {
    console.error('Error appending IP address to session:', e);
    throw new Error('Database error');
  }
}
