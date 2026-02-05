// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 1. Create the connection pool
const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL 
});
const adapter = new PrismaPg(pool);

// 2. Initialize with the adapter to fix the "non-empty" error
export const prisma =
  globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;