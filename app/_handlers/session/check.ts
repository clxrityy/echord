import { db } from '@/lib/db';
import { fetchIp } from '@/utils';

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
