import { db } from "@/lib/db";
import { handleCurrentSession } from "./session";
import { v4 as uuidv4 } from "uuid";
import { decrypt, encrypt } from "@/utils/encrypt";

export async function detectCurrentUserBySession(): Promise<string> {
  const session = await handleCurrentSession();

  if (!session) {
    throw new Error("No active session found");
  }

  const userId = session.userId;

  if (!userId) {
    return "";
  } else {
    return userId;
  }
}

export async function createUser(username: string, pass: string): Promise<string> {
  const existingUser = await detectCurrentUserBySession();

  if (existingUser.length > 1) {
    return existingUser;
  }

  const session = await handleCurrentSession();

  if (!session) {
    throw new Error("Failed to create session");
  }

  try {
    const user = await db.eUser.create({
      data: {
        userId: uuidv4(),
        username: username,
        sessions: {
          connectOrCreate: {
            where: {
              sessionId: session.sessionId,
            },
            create: {
              sessionId: session.sessionId,
              ipAddresses: session.ipAddresses,
              updatedAt: new Date(),
            },
          },
        },
        password: encrypt(pass),
      },
    });
    return user.userId;
  } catch (e) {
    console.error("Error creating user:", e);
    throw new Error("Database error");
  }
}

export async function checkUser(username: string, pass: string): Promise<string | undefined> {

  const existingUser = await detectCurrentUserBySession();

  if (existingUser.length > 1) {
    return existingUser;
  }

  try {
    const user = await db.eUser.findFirst({
      where: {
        username: username,
      }
    });

    if (user) {
      if (decrypt(user.password) === pass) {
        const session = await handleCurrentSession();

        if (!session) {
          throw new Error("Failed to create session");
        }

        await db.eSession.update({
          where: {
            sessionId: session.sessionId,
          },
          data: {
            userId: user.userId,
            ipAddresses: {
              set: session.ipAddresses,
            },
          },
        });

        return user.userId;
      }
    } else {
      return undefined;
    }
  } catch (e) {
    console.error("Error checking user:", e);
    throw new Error("Database error");
  }
}
