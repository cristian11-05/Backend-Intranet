"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@aquanqa.com' },
        update: {},
        create: {
            documento: '00000000',
            nombre: 'Administrador Principal',
            email: 'admin@aquanqa.com',
            contrasena: adminPassword,
            rol: 'ADMIN',
            estado: 'ACTIVO',
        },
    });
    console.log({ admin });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map