import { ENV } from '../utils/constants';
import { jwtVerify, SignJWT } from 'jose';

const secret = ENV.JWT_SECRET;
const key = new TextEncoder().encode(secret);

export async function encryptJWT(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .setSubject(payload.session.sessionId)
    .sign(key);
}

export async function decryptJWT(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}
