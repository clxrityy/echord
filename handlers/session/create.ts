import { db } from "@/lib/db";
import { fetchIp } from "@/utils/ip";
import { v4 as uuidv4 } from 'uuid';

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
