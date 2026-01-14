import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BcryptService } from '../auth/bcrypt.service';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private bcryptService: BcryptService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { documento, email, contrasena, ...rest } = createUserDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ documento }, { email }],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'El documento o email ya se encuentra registrado',
      );
    }

    const hashedPassword = await this.bcryptService.hash(contrasena);

    return this.prisma.user.create({
      data: {
        ...rest,
        documento,
        email,
        contrasena: hashedPassword,
      },
      select: {
        id: true,
        documento: true,
        nombre: true,
        email: true,
        rol: true,
        estado: true,
        area_id: true,
        fecha_registro: true,
      },
    });
  }

  async findAll(role?: string, areaId?: string) {
    return this.prisma.user.findMany({
      where: {
        AND: [
          role ? { rol: role as any } : {},
          areaId ? { area_id: areaId } : {},
        ],
      },
      select: {
        id: true,
        documento: true,
        nombre: true,
        email: true,
        rol: true,
        estado: true,
        area: {
          select: {
            nombre: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        area: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const { contrasena, ...result } = user;
    return result;
  }

  async updateEstado(id: string, estado: 'ACTIVO' | 'INACTIVO') {
    return this.prisma.user.update({
      where: { id },
      data: { estado },
    });
  }
}
