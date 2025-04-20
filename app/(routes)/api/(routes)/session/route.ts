import {
  checkForExistingSession,
  createSession,
  deleteSession,
  getSessionById,
} from '@/app/_actions/session';
import { ENV } from '@/utils/constants';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { sign, verify } from 'jsonwebtoken';
import { serialize } from 'cookie';

export async function POST(_req: NextRequest) {

  const cookieStore = await cookies();
  const isExisting = await checkForExistingSession();

  if (isExisting) {
    return NextResponse.json('Session already exists', { status: 409 });
  }

  const cookie = cookieStore.get(ENV.COOKIE_NAME);

  if (cookie?.value) {
    const decoded = verify(cookie.value, ENV.JWT_SECRET);

    if (decoded && typeof decoded === 'object' && 'sessionId' in decoded) {
      const sessionId = (decoded as { sessionId: string }).sessionId;

      // Check if the session is still valid
      const existingSession = await getSessionById(sessionId);
      if (existingSession) {
        return NextResponse.json({ session: existingSession }, { status: 200 });
      } else {
        // If the session is invalid, delete the cookie
        cookieStore.delete(ENV.COOKIE_NAME);
      }
    }
  }

  // Create a new session if it doesn't exist
  const session = await createSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }

  const token = sign({ session: session }, ENV.JWT_SECRET, {
    expiresIn: '72h',
  });
  try {
    cookieStore.set(
      ENV.COOKIE_NAME,
      serialize(ENV.COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
    );

    return NextResponse.json({ session: session }, { status: 200 });
  } catch (e) {
    console.error('Error setting cookie:', e);
    try {
      await deleteSession(session.sessionId);
      return NextResponse.json(
        { error: 'Failed to set cookie' },
        { status: 500 }
      );
    } catch (e) {
      console.error('Error deleting session:', e);
      return NextResponse.json(
        { error: 'Failed to delete invalid session from database' },
        { status: 500 }
      );
    }
  }
}

export async function GET(_req: NextRequest) {
  const cookieStore = await cookies();

  const token = cookieStore.get(ENV.COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: 'No session found' }, { status: 401 });
  } else {
    try {
      const decoded = verify(token, ENV.JWT_SECRET);
      return NextResponse.json(
        { sessionId: (decoded as { sessionId: string }).sessionId },
        { status: 200 }
      );
    } catch (e) {
      console.error('Error verifying token:', e);
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
  }
}
