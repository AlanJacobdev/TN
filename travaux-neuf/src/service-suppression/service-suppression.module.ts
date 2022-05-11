import { Module } from '@nestjs/common';
import { ServiceSuppressionService } from './service-suppression.service';
import { ServiceSuppressionController } from './service-suppression.controller';

@Module({
  controllers: [ServiceSuppressionController],
  providers: [ServiceSuppressionService]
})
export class ServiceSuppressionModule {}
