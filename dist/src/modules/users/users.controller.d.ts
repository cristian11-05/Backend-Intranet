import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    findAll(rol?: string, areaId?: string): Promise<{
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
    getProfile(user: any): Promise<{
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
