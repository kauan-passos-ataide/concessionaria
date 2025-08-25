import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function resetDatabase() {
  // Lista tabelas do schema público, exceto a de migrations do Prisma
  const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  `;

  const toTruncate = tables
    .map((t) => `"${t.tablename}"`)
    .filter((name) => name !== '"_prisma_migrations"');

  if (toTruncate.length) {
    // TRUNCATE em cascata e reseta IDs
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE ${toTruncate.join(', ')} RESTART IDENTITY CASCADE;`,
    );
  }
}
