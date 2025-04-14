import { db } from "@/lib/db";

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
