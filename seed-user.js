const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        // Buscar si existe un usuario con DNI 12345678
        let user = await prisma.user.findUnique({
            where: { dni: '12345678' }
        });

        if (user) {
            console.log('✅ Usuario ya existe:', user);
        } else {
            // Crear usuario de prueba
            user = await prisma.user.create({
                data: {
                    dni: '12345678',
                    email: 'test@example.com',
                    password: 'password', // En producción esto debería estar hasheado
                    name: 'Usuario de Prueba',
                    role: 'USER'
                }
            });
            console.log('✅ Usuario creado exitosamente:', user);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
