import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './common/health/health.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { SuggestionsModule } from './suggestions/suggestions.module';
import { JustificationsModule } from './justifications/justifications.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ComunicadosModule } from './comunicados/comunicados.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AreasModule } from './areas/areas.module';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    OrdersModule,
    SuggestionsModule,
    JustificationsModule,
    NotificationsModule,
    ComunicadosModule,
    DashboardModule,
    AreasModule,
    ServeStaticModule.forRoot({

      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, LoggerMiddleware)
      .forRoutes('*');
  }
}
