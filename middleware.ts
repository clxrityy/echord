import { NextRequest } from 'next/server';
import { updateUserSession } from '@/lib';

export async function middleware(request: NextRequest) {
  return await updateUserSession(request);
}
