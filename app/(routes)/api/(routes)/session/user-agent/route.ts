import {
  addUserAgentToSession,
  checkSessionUserAgent,
  getSessionById,
} from '@/app/_actions/session';
import { UserAgent } from '@/types';
import { NextRequest, NextResponse, userAgent } from 'next/server';

export async function GET(req: NextRequest) {
  const sessionId = new URL(req.url).searchParams.get('sessionId');

  const session = await getSessionById(sessionId || '');

  if (!session) {
    return NextResponse.json(
      {
        error: 'Session not found',
      },
      {
        status: 404,
      }
    );
  }

  const userId = session.userId;

  if (!userId) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
      },
      {
        status: 401,
      }
    );
  }

  const { isBot, browser, device, os, cpu } = userAgent(req);

  const userAgentInfo = {
    isBot,
    browser: {
      name: browser.name,
      version: browser.version,
      major: browser.major,
    },
    device: {
      type: device.type,
      vendor: device.vendor,
      model: device.model,
    },
    os: {
      name: os.name,
      version: os.version,
    },
    cpu: {
      architecture: cpu.architecture,
    },
  } as UserAgent;

  return NextResponse.json(
    {
      userAgent: JSON.parse(JSON.stringify(userAgentInfo)),
    },
    {
      status: 200,
    }
  );
}

export async function POST(req: NextRequest) {
  const { browser, device, os } = userAgent(req);
  const sessionId = new URL(req.url).searchParams.get('sessionId');

  const session = await getSessionById(sessionId || '');

  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
      },
      {
        status: 401,
      }
    );
  }

  const existingUserAgent = await checkSessionUserAgent(session.sessionId);

  if (existingUserAgent) {
    return NextResponse.json(
      {
        userAgent: existingUserAgent,
      },
      {
        status: 200,
      }
    );
  }

  const userAgentInfo = {
    isBot: false,
    browser: {
      name: browser.name,
      version: browser.version,
      major: browser.major,
    },
    device: {
      type: device.type,
      vendor: device.vendor,
      model: device.model,
    },
    os: {
      name: os.name,
      version: os.version,
    },
  } as UserAgent;

  const newUserAgent = await addUserAgentToSession(
    session.sessionId,
    userAgentInfo
  );

  if (!newUserAgent) {
    return NextResponse.json(
      {
        error: 'Failed to add user agent',
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(
    {
      userAgent: newUserAgent,
    },
    {
      status: 200,
    }
  );
}
