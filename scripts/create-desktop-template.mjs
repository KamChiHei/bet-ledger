import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Bet" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "date" DATETIME NOT NULL,
      "sport" TEXT NOT NULL,
      "event" TEXT NOT NULL,
      "selection" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "odds" REAL NOT NULL,
      "stake" REAL NOT NULL,
      "status" TEXT NOT NULL,
      "returnAmount" REAL NOT NULL DEFAULT 0,
      "profit" REAL NOT NULL DEFAULT 0,
      "roi" REAL NOT NULL DEFAULT 0,
      "notes" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Settings" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
      "initialBankroll" REAL NOT NULL DEFAULT 5000,
      "currency" TEXT NOT NULL DEFAULT 'MOP'
    )
  `);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
