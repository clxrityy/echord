import { getUserSessionId } from '@/lib';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  const sessionId = await getUserSessionId();

  if (!sessionId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const session = await db.eSession.findUnique({
    where: {
      sessionId: sessionId,
    },
  });

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const user = await db.eUser.findUnique({
    where: {
      userId: session.userId,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(
    {
      user: user,
    },
    { status: 200 }
  );
}
