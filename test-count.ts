import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const result = await prisma.('SELECT COUNT(*) FROM suggestions');
  console.log('Result:', JSON.stringify(result));
  process.exit(0);
}
main();
