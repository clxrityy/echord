import {
  checkForExistingSession,
  createSession,
  getSessionById,
} from '@/app/_actions/session';
import { getUserBySessionId } from '@/app/_actions/user';
import { getUserSessionId } from '@/lib';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  const existingSession = await checkForExistingSession(userId);

  if (existingSession) {
    return NextResponse.json('Session already exists', { status: 409 });
  }

  const session = await createSession(userId);

  if (!session) {
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }

  const user = await getUserBySessionId(session.sessionId);

  if (!user) {
    return NextResponse.json(
      { error: 'Failed to get user by session ID' },
      { status: 500 }
    );
  }

  return NextResponse.json({ session: session, user: user }, { status: 200 });
}

export async function GET(_req: NextRequest) {
  const sessionId = await getUserSessionId();

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID not found' },
      { status: 401 }
    );
  }

  const session = await getSessionById(sessionId);

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json({ sessionId: session.sessionId }, { status: 200 });
}
