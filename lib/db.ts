import { PrismaClient } from '@/prisma/app/generated/prisma/client';

function makePrisma(): PrismaClient {
  return new PrismaClient();
}

const globalForPrisma = global as unknown as {
  prisma: ReturnType<typeof makePrisma>;
};

if (typeof window === 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    globalForPrisma.prisma = makePrisma();
  } else {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = makePrisma();
    }
  }
}

export const db: PrismaClient = globalForPrisma.prisma ?? makePrisma();
