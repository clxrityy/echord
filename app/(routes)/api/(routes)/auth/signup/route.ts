import { getSessionByUserId, checkUser, createUser } from '@/app/_actions';
import { buildUserSession } from '@/lib';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { username, password, sessionId } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: 'Username and password are required' },
      { status: 400 }
    );
  }

  if (!sessionId) {
    const user = await createUser(username, password);
    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    const session = await getSessionByUserId(user.userId);

    if (!session) {
      return NextResponse.json(
        { error: 'Failed to retrieve session from user ID' },
        { status: 500 }
      );
    }

    const newSession = await buildUserSession({
      sessionId: session.sessionId,
      userId: user.userId,
      username,
    });

    if (!newSession) {
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'User created successfully', id: user.userId },
      { status: 201 }
    );
  }

  try {
    const existingUserId = await checkUser(username, sessionId);

    if (existingUserId) {
      return NextResponse.json(
        {
          error: 'User already exists',
          id: existingUserId,
        },
        { status: 409 }
      );
    }

    const user = await createUser(username, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create a session for the user
    const session = await buildUserSession({
      sessionId,
      userId: user.userId,
      username,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'User created successfully', id: user.userId },
      { status: 201 }
    );
  } catch (e) {
    console.error('Error during signup:', e);
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}
