import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    {
      message: 'Pong',
    },
    {
      status: 200,
    }
  );
}
