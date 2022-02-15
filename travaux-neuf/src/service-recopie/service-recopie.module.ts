import { Module } from '@nestjs/common';
import { ServiceRecopieService } from './service-recopie.service';
import { ServiceRecopieController } from './service-recopie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Objetrepere } from 'src/objetrepere/entities/objetrepere.entity';
import { Item } from 'src/item/entities/item.entity';
import { Sousitem } from 'src/sousitem/entities/sousitem.entity';
import { SousitemModule } from 'src/sousitem/sousitem.module';
import { ObjetrepereModule } from 'src/objetrepere/objetrepere.module';
import { ItemModule } from 'src/item/item.module';
import { ConfigService } from '@nestjs/config';
@Module({
  imports : [TypeOrmModule.forFeature([Objetrepere, Item, Sousitem]), ObjetrepereModule, ItemModule, SousitemModule],
  controllers: [ServiceRecopieController],
  providers: [ServiceRecopieService, ConfigService]
})
export class ServiceRecopieModule {}
