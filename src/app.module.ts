import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AreasModule } from './modules/areas/areas.module';
import { JustificationsModule } from './modules/justifications/justifications.module';
import { SuggestionsModule } from './modules/suggestions/suggestions.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AreasModule,
    JustificationsModule,
    SuggestionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
