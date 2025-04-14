import { handleCurrentSession } from '@/app/_handlers/session';
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
      userAgent: userAgentInfo,
    },
    {
      status: 200,
    }
  );
}
