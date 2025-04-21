import { checkUser } from '@/app/_actions/user';
import { updateUserSession } from '@/lib';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { username, password, sessionId } = (await req.json()) as {
    username: string;
    password: string;
    sessionId: string;
  };

  if (!username || !password) {
    return NextResponse.json(
      { error: 'Username and password are required' },
      { status: 400 }
    );
  }

  try {
    const userId = await checkUser(username, sessionId);

    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    await updateUserSession(req);

    return NextResponse.json(
      {
        message: 'User logged in successfully',
        id: userId,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error('Error during login:', e);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
