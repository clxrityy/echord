import { ENV } from '@/utils';
import { jwtVerify, SignJWT } from 'jose';

const secret = ENV.JWT_SECRET;
const key = new TextEncoder().encode(secret);

export async function encryptJWT(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 7 days
    .setSubject(payload.session.sessionId)
    .sign(key);
}

export async function decryptJWT(input: string) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.error('Error decrypting JWT:', error);
    return null;
  }
}
