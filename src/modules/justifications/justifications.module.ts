import { Module } from '@nestjs/common';
import { JustificationsService } from './justifications.service';
import { JustificationsController } from './justifications.controller';

@Module({
  controllers: [JustificationsController],
  providers: [JustificationsService],
})
export class JustificationsModule {}
