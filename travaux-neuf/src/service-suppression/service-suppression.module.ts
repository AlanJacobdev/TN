import { Module } from '@nestjs/common';
import { ServiceSuppressionService } from './service-suppression.service';
import { ServiceSuppressionController } from './service-suppression.controller';
import { SousitemModule } from 'src/sousitem/sousitem.module';
import { ItemModule } from 'src/item/item.module';
import { ObjetrepereModule } from 'src/objetrepere/objetrepere.module';

@Module({
  imports : [SousitemModule, ItemModule, ObjetrepereModule],
  controllers: [ServiceSuppressionController],
  providers: [ServiceSuppressionService],
  exports : [ServiceSuppressionService]
})
export class ServiceSuppressionModule {}
