import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BcryptService } from '../auth/bcrypt.service';
export declare class UsersService {
    private prisma;
    private bcryptService;
    constructor(prisma: PrismaService, bcryptService: BcryptService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        documento: string;
        email: string;
        nombre: string;
        area_id: string;
        rol: import(".prisma/client").$Enums.Role;
        estado: import(".prisma/client").$Enums.UserStatus;
        fecha_registro: Date;
    }>;
    findAll(role?: string, areaId?: string): Promise<{
        id: string;
        documento: string;
        email: string;
        nombre: string;
        rol: import(".prisma/client").$Enums.Role;
        estado: import(".prisma/client").$Enums.UserStatus;
        area: {
            nombre: string;
        };
    }[]>;
    findOne(id: string): Promise<{
        area: {
            id: string;
            nombre: string;
            descripcion: string | null;
        };
        id: string;
        documento: string;
        email: string;
        nombre: string;
        area_id: string | null;
        rol: import(".prisma/client").$Enums.Role;
        estado: import(".prisma/client").$Enums.UserStatus;
        fecha_registro: Date;
    }>;
    updateEstado(id: string, estado: 'ACTIVO' | 'INACTIVO'): Promise<{
        id: string;
        documento: string;
        email: string;
        nombre: string;
        contrasena: string;
        area_id: string | null;
        rol: import(".prisma/client").$Enums.Role;
        estado: import(".prisma/client").$Enums.UserStatus;
        fecha_registro: Date;
    }>;
}
