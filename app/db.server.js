import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

export function getPrismaClient(db) {
  return new PrismaClient({ adapter: new PrismaD1(db) });
}
