import { db } from '@/lib/db';
import { fetchIp } from '@/utils/ip';
import { v4 as uuidv4 } from 'uuid';

export async function handleCurrentSession() {
  const ip = await fetchIp();
  if (!ip) {
    throw new Error('Failed to fetch IP');
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
