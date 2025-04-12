import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prismaClientWithExtensions = new PrismaClient().$extends(
  withAccelerate(),
);
type PrismaClientWithExtensions = typeof prismaClientWithExtensions;

const globalForPrisma = global as unknown as {
  prisma: PrismaClientWithExtensions;
};

const prisma: PrismaClientWithExtensions =
  globalForPrisma.prisma || prismaClientWithExtensions;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
