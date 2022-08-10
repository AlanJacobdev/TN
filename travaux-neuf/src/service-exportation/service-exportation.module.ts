import { Module } from '@nestjs/common';
import { ServiceExportationService } from './service-exportation.service';
import { ServiceExportationController } from './service-exportation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/item/entities/item.entity';
import { ItemModule } from 'src/item/item.module';
import { Objetrepere } from 'src/objetrepere/entities/objetrepere.entity';
import { ObjetrepereModule } from 'src/objetrepere/objetrepere.module';
import { Sousitem } from 'src/sousitem/entities/sousitem.entity';
import { SousitemModule } from 'src/sousitem/sousitem.module';
import { ExportationModule } from 'src/exportation/exportation.module';

@Module({
  imports : [TypeOrmModule.forFeature([Objetrepere, Item, Sousitem]), ObjetrepereModule, ItemModule, SousitemModule, ExportationModule],
  controllers: [ServiceExportationController],
  providers: [ServiceExportationService]
})
export class ServiceExportationModule {}
