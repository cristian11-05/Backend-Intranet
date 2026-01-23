const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    users.forEach(u => {
        console.log('\n====================');
        console.log('ID:', u.id);
        console.log('DNI:', u.dni);
        console.log('Email:', u.email);
        console.log('Password:', u.password);
        console.log('Name:', u.name);
        console.log('Role:', u.role);
    });
    await prisma.$disconnect();
}

main().catch(console.error);
