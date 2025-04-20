import { db } from '@/lib/db';
import { BASE_URL, fetchIp } from '@/utils';
import { getSessionByUserId } from './get';
import { createSession } from './create';
import { ESession } from '@/prisma/app/generated/prisma/client';

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
      return await createSession(userId);
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
      const res = await fetch(`${BASE_URL}/api/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });
      const { session } = await res.json();
      if (!session) {
        throw new Error('Failed to create session');
      }
      return session as ESession;
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
