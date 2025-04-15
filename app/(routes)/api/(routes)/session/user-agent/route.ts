import {
  addUserAgentToSession,
  checkSessionUserAgent,
  handleCurrentSession,
} from '@/app/_handlers/session';
import { UserAgent } from '@/types';
import { NextRequest, NextResponse, userAgent } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await handleCurrentSession();

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
  const session = await handleCurrentSession();

  const userId = session.userId;
  const sessionId = session.sessionId;

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

  const existingUserAgent = await checkSessionUserAgent(sessionId);

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

  const newUserAgent = await addUserAgentToSession(sessionId, userAgentInfo);

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
