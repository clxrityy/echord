import { db } from "@/lib";
import { EUser } from "@/prisma/app/generated/prisma/client";

export async function getUserBySessionId(
  sessionId: string
): Promise<EUser | null> {
  try {
    const session = await db.eSession.findFirst({
      where: {
        sessionId: sessionId,
      },
      include: {
        EUser: true,
      },
    });

    if (session && session.EUser) {
      return session.EUser;
    } else {
      return null;
    }
  } catch (e) {
    console.error('Error getting user by session ID:', e);
    throw new Error('Database error');
  }
}
