import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const areas = await prisma.areas.findMany({
        orderBy: { id: 'asc' }
    });
    console.log('--- Escribiendo áreas a areas-db.json ---');
    fs.writeFileSync('areas-db.json', JSON.stringify(areas, null, 2));
    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
