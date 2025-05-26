import { ENV } from '@/util';
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
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return userSession;
  } catch (error) {
    console.log('Error building user session (setting cookie):', error);
  }
}

export async function getUserSession() {
  const session = (await cookies()).get(ENV.COOKIE_NAME);
  if (!session) return null;

  try {
    const parsed = await decryptJWT(session.value);

    if (parsed) {
      // Check if the session is expired
      const now = Date.now();
      if (parsed.exp && parsed.exp < now) {
        parsed.exp = 1000 * 60 * 60 * 24 * 7; // 7 days
      }
      return parsed;
    } else {
      try {
        await logoutUserSession();
        console.log('Session expired, logging out user session');
        return null;
      } catch (error) {
        console.log('Error logging out user session (deleting cookie):', error);
      }
    }
  } catch (error) {
    console.log('Error decrypting user session:', error);
    try {
      await logoutUserSession();
      console.log('Session expired, logging out user session');
    } catch (error) {
      console.log('Error logging out user session (deleting cookie):', error);
    }
    return null;
  }
}

export async function updateUserSession(request: NextRequest) {
  const userSession = request.cookies.get(ENV.COOKIE_NAME);
  if (!userSession) return;

  // Refresh the session
  const parsed = await decryptJWT(userSession.value);

  if (!parsed) {
    return await logoutUserSession();
  }
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

  const res = NextResponse.next();
  res.cookies.set({
    name: ENV.COOKIE_NAME,
    value: await encryptJWT(parsed),
    expires,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}

export async function logoutUserSession() {
  const res = NextResponse.next();
  res.cookies.delete(ENV.COOKIE_NAME);
  res.cookies.set({
    name: ENV.COOKIE_NAME,
    value: '',
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  });
  return res;
}

export async function getUserSessionId() {
  const session = await getUserSession();
  if (!session) {
    try {
      await logoutUserSession();
      console.log('Session expired, logging out user session');
    } catch (error) {
      console.log('Error logging out user session (deleting cookie):', error);
    }
    return null;
  }

  return (
    session.session as { sessionId: string; userId: string; username: string }
  ).sessionId;
}
