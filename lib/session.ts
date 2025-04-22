import { ENV } from '@/utils';
import { decryptJWT, encryptJWT } from './jwt';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function buildUserSession({
  sessionId,
  userId,
  username,
}: {
  sessionId: string;
  userId: string;
  username: string;
}) {
  const session = {
    sessionId,
    userId,
    username,
  };

  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

  const userSession = await encryptJWT({
    session,
    expires,
  });

  try {
    (await cookies()).set(ENV.COOKIE_NAME, userSession, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return userSession;
  } catch (error) {
    console.error('Error building user session (setting cookie):', error);
    throw new Error('Failed to build user session');
  }
}

export async function getUserSession() {
  const session = (await cookies()).get(ENV.COOKIE_NAME);
  if (!session) return null;

  return await decryptJWT(session.value);
}

export async function updateUserSession(request: NextRequest) {
  const userSession = request.cookies.get(ENV.COOKIE_NAME);
  if (!userSession) return;

  // Refresh the session
  const parsed = await decryptJWT(userSession.value);
  parsed.exp = 1000 * 60 * 60 * 24 * 7; // 7 days
  const expires = new Date(Date.now() + parsed.exp);

  const res = NextResponse.next();
  res.cookies.set({
    name: ENV.COOKIE_NAME,
    value: await encryptJWT(parsed),
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return res;
}

export async function logoutUserSession() {
  try {
    (await cookies()).delete(ENV.COOKIE_NAME);
  } catch (error) {
    console.error('Error logging out user session (deleting cookie):', error);
    throw new Error('Failed to log out user session');
  }
}

export async function getUserSessionId() {
  const session = await getUserSession();
  if (!session) return null;

  return (
    session.session as { sessionId: string; userId: string; username: string }
  ).sessionId;
}
