import { ENV } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
  try {
    const res = NextResponse.next();
    res.cookies.delete(ENV.COOKIE_NAME);
    res.cookies.set(ENV.COOKIE_NAME, '', {
      name: ENV.COOKIE_NAME,
      value: '',
      expires: new Date(0),
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
    });

    return NextResponse.json(
      { message: 'Logged out successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in logout route:', error);
    return NextResponse.json(
      { error: 'An error occurred while logging out.' },
      { status: 500 }
    );
  }
}
