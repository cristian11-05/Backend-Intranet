const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                dni: true,
                email: true,
                password: true,
                name: true,
                role: true
            }
        });

        console.log('📋 Usuarios en la base de datos:');
        console.table(users);
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
