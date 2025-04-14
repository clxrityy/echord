import { db } from "@/lib/db";

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
