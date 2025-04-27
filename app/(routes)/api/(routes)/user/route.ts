import { db } from '@/lib';
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
