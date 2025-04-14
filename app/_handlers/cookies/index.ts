import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { serialize } from 'cookie';
import { ENV } from '@/utils';

type CreateCookieProps = {
  userId: string;
  sessionId: string;
}

export async function createCookie(props: CreateCookieProps): Promise<{
  success: boolean;
  error?: string;
}>{
  try {
    const token = sign(props, ENV.JWT_SECRET, {
      expiresIn: "72h"
    });

    (await cookies()).set(ENV.COOKIE_NAME, serialize(ENV.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 3, // 72 hours
    }));

    return {
      success: true,
    }
  } catch (e) {
    console.error("Error creating cookie", e);
    return {
      success: false,
      error: `Error creating cookie: ${e}`,
    }
  }
}

export async function getCookie() {
  try {
    const cookie = (await cookies()).get(ENV.COOKIE_NAME);

    if (!cookie) {
      return null;
    }

    return cookie.value;
  } catch (e) {
    console.error("Error getting cookie", e);
    return null;
  }
}

export async function deleteCookie() {
  try {
    (await cookies()).delete(ENV.COOKIE_NAME);
  } catch (e) {
    console.error("Error deleting cookie", e);
  }
}
