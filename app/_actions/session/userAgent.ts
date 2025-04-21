import { db } from '@/lib/db';
import { EUserAgent } from '@/prisma/app/generated/prisma/client';
import { UserAgent } from '@/types';

export async function checkSessionUserAgent(
  sessionId: string
): Promise<EUserAgent[] | null> {
  const session = await db.eSession.findUnique({
    where: {
      sessionId: sessionId,
    },
    include: {
      userAgent: true,
    },
  });

  if (!session) {
    throw new Error('Session not found');
  }

  const userAgent = session.userAgent;

  if (!userAgent.length || userAgent.length === 0) {
    return null;
  }

  return userAgent;
}

export async function addUserAgentToSession(
  sessionId: string,
  userAgent: UserAgent
): Promise<EUserAgent> {
  const session = await db.eSession.findUnique({
    where: {
      sessionId: sessionId,
    },
  });

  if (!session) {
    throw new Error('Session not found');
  }

  const agent: Partial<EUserAgent> = {
    sessionId: session.sessionId,
    os: `${userAgent.os.name} ${userAgent.os.version}`,
    browser: `${userAgent.browser.name} ${userAgent.browser.version}`,
    device: `${userAgent.device.vendor} ${userAgent.device.model} ${userAgent.device.type}`,
  };

  const userAgentExists = await db.eUserAgent.findFirst({
    where: {
      sessionId: session.sessionId,
      os: agent.os,
      browser: agent.browser,
      device: agent.device,
    },
  });

  if (userAgentExists) {
    const userAgentExistsInSession = await db.eSession.findFirst({
      where: {
        sessionId: session.sessionId,
        userAgent: {
          some: {
            id: userAgentExists.id,
          },
        },
      },
    });

    try {
      if (!userAgentExistsInSession) {
        await db.eSession.update({
          where: {
            sessionId: session.sessionId,
          },
          data: {
            userAgent: {
              connect: {
                id: userAgentExists.id,
              },
            },
          },
        });
      }

      return userAgentExists;
    } catch (e) {
      console.error(e);
      throw new Error('Error updating session with user agent');
    }
  }

  try {
    const newUserAgent = await db.eUserAgent.create({
      data: {
        os: `${userAgent.os.name} ${userAgent.os.version}`,
        browser: `${userAgent.browser.name} ${userAgent.browser.version}`,
        device: `${userAgent.device.vendor} ${userAgent.device.model} ${userAgent.device.type}`,
        session: {
          connect: {
            sessionId: session.sessionId,
          },
        },
      },
    });

    await db.eSession.update({
      where: {
        sessionId: session.sessionId,
      },
      data: {
        userAgent: {
          connect: {
            id: newUserAgent.id,
          },
        },
      },
    });

    return newUserAgent;
  } catch (e) {
    console.error(e);
    throw new Error('Error creating user agent');
  }
}
