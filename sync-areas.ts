import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Sincronizando áreas ---');

    // We safely use transaction to delete existing and create new
    // Note: This might fail if there are foreign key constraints (users linked to areas)
    // We'll try to update existing IDs or handle the constraint.

    const desiredAreas = [
        { id: 1, nombre: 'Remuneraciones', descripcion: 'Área de Remuneraciones' },
        { id: 2, nombre: 'Bienestar Social', descripcion: 'Área de Bienestar Social' },
        { id: 3, nombre: 'ADP', descripcion: 'Área de ADP' },
        { id: 4, nombre: 'Recursos Humanos', descripcion: 'Área de Recursos Humanos' },
    ];

    for (const area of desiredAreas) {
        await prisma.areas.upsert({
            where: { id: area.id },
            update: {
                nombre: area.nombre,
                descripcion: area.descripcion
            },
            create: {
                id: area.id,
                nombre: area.nombre,
                descripcion: area.descripcion
            }
        });
    }

    console.log('--- Sincronización finalizada ---');
    const result = await prisma.areas.findMany({ orderBy: { id: 'asc' } });
    console.log(JSON.stringify(result, null, 2));

    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
