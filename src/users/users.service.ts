import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { users as User, Prisma } from '@prisma/client';
import * as ExcelJS from 'exceljs';
import { sanitizeEmpresa } from '../common/utils/string.utils';


@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(where: Prisma.usersWhereInput): Promise<User | null> {
        return this.prisma.users.findFirst({
            where,
            include: {
                area: {
                    select: {
                        id: true,
                        nombre: true,
                    }
                }
            }
        });
    }


    async findAll(page: number = 1, limit: number = 5000) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.users.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    nombre: true,
                    rol: true,
                    estado: true,
                    documento: true,
                    area_id: true,
                    empresa: true,
                    fecha_registro: true,
                    area: {
                        select: {
                            id: true,
                            nombre: true,
                        }
                    },
                    // Excluded: contrasena (security/performance)
                },
                orderBy: [
                    { estado: 'desc' },
                    { fecha_registro: 'desc' }
                ]
            }),
            this.prisma.users.count(),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    }

    async exportUsers(): Promise<string> {
        const { data: users } = await this.findAll(1, 10000);
        const headers = ['Nombre', 'Documento', 'Email', 'Rol', 'Empresa', 'Estado', 'Area'];
        const csvRows = [headers.join(',')];

        for (const user of users) {
            const row = [
                `"${user.nombre || ''}"`,
                user.documento || '',
                user.email,
                user.rol || '',
                user.empresa || '',
                user.estado ? 'Activo' : 'Inactivo',
                `"${user.area?.nombre || ''}"`
            ];
            csvRows.push(row.join(','));
        }
        return csvRows.join('\n');
    }

    async create(data: Prisma.usersCreateInput): Promise<User> {
        return this.prisma.users.create({
            data,
        });
    }

    async update(id: number, data: Prisma.usersUpdateInput): Promise<User> {
        return this.prisma.users.update({
            where: { id },
            data,
        });
    }

    async remove(id: number): Promise<User> {
        return this.prisma.users.delete({
            where: { id },
        });
    }

    async bulkRemove(documents: string[], action: 'inactivate' | 'delete' = 'inactivate'): Promise<{ success: number }> {
        if (action === 'delete') {
            const result = await this.prisma.users.deleteMany({
                where: { documento: { in: documents } }
            });
            return { success: result.count };
        } else {
            const result = await this.prisma.users.updateMany({
                where: { documento: { in: documents } },
                data: { estado: false }
            });
            return { success: result.count };
        }
    }

    async importExcel(buffer: Buffer): Promise<{ success: number; errors: any[] }> {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer as any);
        const worksheet = workbook.getWorksheet(1);

        if (!worksheet) {
            throw new Error('La hoja de cálculo está vacía');
        }

        const users: any[] = [];
        const errors: any[] = [];
        let successCount = 0;

        const normalizeHeader = (header: string) => {
            return header.toLowerCase()
                .trim()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, '_');
        };

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header

            const rowData: any = {};
            row.eachCell((cell, colNumber) => {
                const rawHeader = worksheet.getRow(1).getCell(colNumber).value?.toString();
                if (rawHeader) {
                    const header = normalizeHeader(rawHeader);
                    rowData[header] = cell.value;
                }
            });

            users.push({ rowData, rowNumber });
        });

        for (const { rowData, rowNumber } of users) {
            try {
                const documento = (rowData.documento || rowData.dni || rowData.nro_documento)?.toString();
                // Prioritize documento as the login identifier (email) and password, as requested
                const email = documento || rowData.email;

                // Construct name from possible multi-column format or single 'nombre' column
                let nombre = rowData.nombre?.toString();
                if (!nombre && (rowData.nombres || rowData.apellido_paterno)) {
                    nombre = `${rowData.nombres || ''} ${rowData.apellido_paterno || ''} ${rowData.apellido_materno || ''}`.trim();
                }

                let rol = rowData.rol || rowData.tipo_contrato || rowData.tipo_de_contrato || 'OBRERO';
                // Normalize role to UserRole enum values
                const rolLower = rol.toString().toLowerCase();
                if (rolLower.includes('obr')) rol = 'OBRERO';
                else if (rolLower.includes('trab')) rol = 'TRABAJADOR';
                else if (rolLower.includes('emp')) rol = 'EMPLEADO';
                else if (rolLower.includes('adm') || rolLower.includes('ges')) rol = 'ADMIN';
                else rol = 'OBRERO'; // Default for unrecognized values

                const estadoRaw = rowData.estado || rowData.status || rowData.condicion;
                const estado = (estadoRaw === 'Activo' || estadoRaw === true || estadoRaw === 'true' || estadoRaw?.toString().toLowerCase().includes('alta'));

                const area_id_raw = rowData.area_id || rowData.areaid || rowData.area_id_ || rowData.id_area;
                const area_id = area_id_raw ? parseInt(area_id_raw.toString()) : undefined;

                const empresa = sanitizeEmpresa(rowData.empresa);

                const contrasena = documento || rowData.contrasena || rowData.password;


                if (!documento || !email) {
                    errors.push({ row: rowNumber, error: 'Documento y Email son requeridos (o DNI para autogenerar email)' });
                    continue;
                }

                await this.prisma.users.upsert({
                    where: { email },
                    update: {
                        nombre,
                        rol,
                        estado,
                        area_id,
                        documento,
                        contrasena,
                        empresa,
                    },
                    create: {
                        nombre: nombre || 'Usuario Importado',
                        email,
                        documento,
                        rol,
                        estado,
                        area_id,
                        empresa,
                        contrasena: contrasena || documento,
                    },
                });
                successCount++;
            } catch (err) {
                errors.push({ row: rowNumber, error: err.message });
            }
        }

        return { success: successCount, errors };
    }
}
