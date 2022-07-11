import { Module } from '@nestjs/common';
import { ServiceSuppressionService } from './service-suppression.service';
import { ServiceSuppressionController } from './service-suppression.controller';
import { SousitemModule } from 'src/sousitem/sousitem.module';
import { ItemModule } from 'src/item/item.module';
import { ObjetrepereModule } from 'src/objetrepere/objetrepere.module';
import { ParametreModule } from 'src/parametre/parametre.module';

@Module({
  imports : [SousitemModule, ItemModule, ObjetrepereModule, ParametreModule],
  controllers: [ServiceSuppressionController],
  providers: [ServiceSuppressionService],
  exports : [ServiceSuppressionService]
})
export class ServiceSuppressionModule {}
