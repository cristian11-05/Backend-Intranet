import { Module } from '@nestjs/common';
import { ComunicadosService } from './comunicados.service';
import { ComunicadosController } from './comunicados.controller';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../common/services/storage.service';

import { UsersModule } from '../users/users.module';

@Module({
    imports: [UsersModule],
    controllers: [ComunicadosController],
    providers: [ComunicadosService, PrismaService, StorageService],
})
export class ComunicadosModule { }
