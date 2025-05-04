import { db } from '@/lib/db';
import { fetchIp } from '@/util';

export async function checkForExistingSession(sessionId?: string) {
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
        OR: [
          {
            sessionId: sessionId,
          },
        ],
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
