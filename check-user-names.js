
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function main() {
    // Search for the user likely used. Since user mentioned "Cristian Zavaleta", let's search by likely name or document.
    // Also listing all users to see what's there.
    const users = await prisma.user.findMany();
    console.log('All Users:');
    users.forEach(u => {
        console.log(`ID: ${u.id}, Documento: ${u.documento}, Nombre: ${u.nombre}, Email: ${u.email}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
