import { ENV } from '@/util';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(_req: NextRequest) {

  const cookieStore = await cookies();

  try {
    cookieStore.set(ENV.COOKIE_NAME, '', {
      name: ENV.COOKIE_NAME,
      value: '',
      expires: new Date(0),
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
    });
    cookieStore.delete(ENV.COOKIE_NAME);

    return NextResponse.json(
      { message: 'Logged out successfully.' },
      {
        status: 200,
        headers: {
          'Set-Cookie': `${ENV.COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax; Secure=${process.env.NODE_ENV === 'production'}`,
        }
       },
    );
  } catch (error) {
    console.error('Error in logout route:', error);
    return NextResponse.json(
      { error: 'An error occurred while logging out.' },
      { status: 500 }
    );
  }
}
