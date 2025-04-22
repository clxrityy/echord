import { logoutUserSession } from '@/lib';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
  try {
    await logoutUserSession();
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
