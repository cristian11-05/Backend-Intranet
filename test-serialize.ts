import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  try {
    const result = await prisma.$queryRawUnsafe('SELECT * FROM suggestions LIMIT 1');
    console.log('Result type:', typeof (result as any)[0].id);
    console.log('JSON:', JSON.stringify(result));
  } catch (e: any) {
    console.error('Error:', e.message);
  }
  process.exit(0);
}
main();
