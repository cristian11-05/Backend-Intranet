import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seeding...');

    // 1. Create Areas
    const areas = [
        { nombre: 'General', descripcion: 'Área general' },
        { nombre: 'Sistemas', descripcion: 'Departamento de TI' },
        { nombre: 'RRHH', descripcion: 'Recursos Humanos' },
    ];

    for (const area of areas) {
        const existingArea = await prisma.areas.findFirst({ where: { nombre: area.nombre } });
        if (!existingArea) {
            await prisma.areas.create({ data: area });
            console.log(`Created area: ${area.nombre}`);
        }
    }

    const sistemasArea = await prisma.areas.findFirst({ where: { nombre: 'Sistemas' } });
    const generalArea = await prisma.areas.findFirst({ where: { nombre: 'General' } });

    // 2. Create Users
    // Admin User
    const adminEmail = 'admin@aquanqa.com';
    const existingAdmin = await prisma.users.findUnique({ where: { email: adminEmail } });

    if (!existingAdmin) {
        await prisma.users.create({
            data: {
                nombre: 'Administrador',
                email: adminEmail,
                contrasena: 'password', // Plain text based on auth.service.ts
                rol: 'admin',
                area_id: sistemasArea?.id,
                estado: true,
                documento: '00000000',
            },
        });
        console.log(`Created user: ${adminEmail}`);
    }

    // Employee User
    const empEmail = 'empleado@aquanqa.com';
    const existingEmp = await prisma.users.findUnique({ where: { email: empEmail } });

    if (!existingEmp) {
        await prisma.users.create({
            data: {
                nombre: 'Empleado Test',
                email: empEmail,
                contrasena: 'password',
                rol: 'empleado',
                area_id: generalArea?.id,
                estado: true,
                documento: '11111111',
            },
        });
        console.log(`Created user: ${empEmail}`);
    }

    // 3. Create Suggestions & Justifications
    if (existingEmp) {
        // Suggestions
        const suggestionTitle = 'Mejorar menú vegetariano';
        const existingSuggestion = await prisma.suggestions.findFirst({ where: { titulo: suggestionTitle } });

        if (!existingSuggestion) {
            await prisma.suggestions.create({
                data: {
                    titulo: suggestionTitle,
                    descripcion: 'Sería bueno tener más opciones de ensaladas.',
                    tipo: 'Menú',
                    estado: 0, // Pendiente
                    usuario_id: existingEmp.id,
                    area_id: generalArea?.id,
                },
            });
            console.log('Created suggestion');
        }

        // Justifications
        const justificationTitle = 'Cita médica';
        const existingJustification = await prisma.justifications.findFirst({ where: { titulo: justificationTitle } });

        if (!existingJustification) {
            await prisma.justifications.create({
                data: {
                    titulo: justificationTitle,
                    descripcion: 'Tengo revisión anual en la clínica.',
                    fecha_evento: new Date(),
                    hora_inicio: '08:00',
                    hora_fin: '10:00',
                    estado: 0, // Pendiente
                    usuario_id: existingEmp.id,
                    area_id: generalArea?.id,
                },
            });
            console.log('Created justification');
        }
    }

    console.log('✅ Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
