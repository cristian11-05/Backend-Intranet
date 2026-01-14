import { Role, UserStatus } from '@prisma/client';
export declare class CreateUserDto {
    documento: string;
    nombre: string;
    email: string;
    contrasena: string;
    area_id?: string;
    rol?: Role;
    estado?: UserStatus;
}
