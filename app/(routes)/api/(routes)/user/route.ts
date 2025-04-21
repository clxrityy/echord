import { db } from '@/lib';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { userId } = await req.json();

  const user = await db.eUser.findUnique({
    where: {
      userId: userId,
    }
  });

  if (!user) {
    return NextResponse.json({ user: null }, { status: 404 });
  }

  return NextResponse.json({ user }, { status: 200 });
}
