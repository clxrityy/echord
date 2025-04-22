import { checkUser, checkUserByPasswordAndUsername } from '@/app/_actions';
import { buildUserSession } from '@/lib';
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

  if (!sessionId) {
    const user = await checkUserByPasswordAndUsername(username, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    try {
      const session = await buildUserSession({
        sessionId: user.sessionId,
        userId: user.userId,
        username: user.username,
      });

      return NextResponse.json(
        {
          message: 'User logged in successfully',
          id: user.userId,
          session: session,
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

  try {
    const userId = await checkUser(username, sessionId);

    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const session = await buildUserSession({
      sessionId,
      userId,
      username,
    })

    return NextResponse.json(
      {
        message: 'User logged in successfully',
        id: userId,
        session: session
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
