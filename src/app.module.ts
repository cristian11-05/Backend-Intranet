import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';

import { SuggestionsModule } from './suggestions/suggestions.module';
import { JustificationsModule } from './justifications/justifications.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ComunicadosModule } from './comunicados/comunicados.module';

@Module({
  imports: [AuthModule, UsersModule, OrdersModule, SuggestionsModule, JustificationsModule, NotificationsModule, ComunicadosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
