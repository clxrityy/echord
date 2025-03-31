import { db } from '@/lib/db';
import { BASE_URL } from '@/utils/constants';
import { fetchIp } from '@/utils/ip';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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

export async function createSession() {
  const ip = await fetchIp();

  if (!ip) {
    throw new Error('Failed to fetch IP or User-Agent');
  }

  const sessionId = uuidv4();

  try {
    const newSession = await db.eSession.create({
      data: {
        sessionId,
        ipAddresses: [ip],
      },
    });
    return newSession;
  } catch (e) {
    console.error('Error creating session:', e);
    throw new Error('Database error');
  }
}

export async function checkForExistingSession() {
  const ip = await fetchIp();
  if (!ip) {
    throw new Error('Failed to fetch IP');
  }
  try {
    const existing = await db.eSession.findFirst({
      where: {
        ipAddresses: {
          has: ip,
        },
      },
    });

    if (existing) {
      return existing;
    } else {
      return false;
    }
  } catch (e) {
    console.error('Error checking for existing session:', e);
    throw new Error('Database error');
  }
}

export async function deleteSession(id: string) {
  try {
    const deletedSession = await db.eSession.delete({
      where: {
        sessionId: id,
      },
    });
    return deletedSession;
  } catch (e) {
    console.error('Error deleting session:', e);
    throw new Error('Database error');
  }
}

export async function getSessionById(id: string) {
  try {
    const session = await db.eSession.findUnique({
      where: {
        sessionId: id,
      },
    });
    return session;
  } catch (e) {
    console.error('Error fetching session by ID:', e);
    throw new Error('Database error');
  }
}

export async function getSessionByUserId(userId: string) {
  try {
    const session = await db.eSession.findMany({
      where: {
        userId,
      },
    });

    if (session.length > 0) {
      const latestSession = session[session.length - 1];

      try {
        const updatedSession = await db.eSession.update({
          where: {
            sessionId: latestSession.sessionId,
          },
          data: {
            updatedAt: new Date(),
          },
        });

        return updatedSession;
      } catch (e) {
        console.error('Error updating session:', e);
        throw new Error('Database error');
      }
    }

  } catch (e) {
    console.error('Error fetching session by user ID:', e);
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
