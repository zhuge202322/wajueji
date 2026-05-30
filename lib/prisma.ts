import { PrismaClient } from '@prisma/client';
import { configureDatabaseUrl, ensureCmsDatabase } from './cms-runtime';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

configureDatabaseUrl();

const prismaClient = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;

export const prisma = prismaClient.$extends({
  query: {
    $allModels: {
      async $allOperations({ args, query }) {
        await ensureCmsDatabase(prismaClient);
        return query(args);
      }
    }
  }
});
