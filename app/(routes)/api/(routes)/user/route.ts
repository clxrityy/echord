import { db, getUserSessionId } from '@/lib';
import { User } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ user: null }, { status: 400 });
  }

  const user = (await db.eUser.findUnique({
    where: {
      userId: userId,
    },
    include: {
      interactions: true,
      session: true,
      searches: true,
    },
  })) as User;

  if (!user) {
    return NextResponse.json({ user: null }, { status: 404 });
  }

  return NextResponse.json({ user }, { status: 200 });
}

export async function PATCH(req: NextRequest) {
  const { userId } = await req.json();
  const sessionId = await getUserSessionId();

  if (!userId) {
    return NextResponse.json(
      {
        error: 'User ID is required',
      },
      { status: 400 }
    );
  }

  if (!sessionId) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const user = await db.eUser.findUnique({
    where: {
      userId: userId,
      session: {
        sessionId: sessionId,
      }
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        error: "User not found",
      },
      { status: 404 }
    );
  }

  const updatedUser = await db.eUser.update({
    where: {
      userId: userId,
      session: {
        sessionId: sessionId,
      }
    },
    data: {
      ...user,
      updatedAt: new Date(),
    }
  });

  return NextResponse.json(
    {
      user: updatedUser,
    },
    { status: 200 }
  );
}
