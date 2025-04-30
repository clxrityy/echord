import { db } from "@/lib";

export async function updateUser(userId: string, sessionId: string) {
  const user = await db.eUser.findFirst({
    where: {
      userId,
      session: {
        sessionId
      }
    }
  });

  if (!user) {
    return null;
  }

  const updatedUser = await db.eUser.update({
    where: {
      userId
    },
    data: {
      updatedAt: new Date()
    }
  });

  return updatedUser;
}
