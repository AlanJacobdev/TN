import { Module } from '@nestjs/common';
import { ServiceAccueilService } from './service-accueil.service';
import { ServiceAccueilController } from './service-accueil.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/item/entities/item.entity';
import { Sousitem } from 'src/sousitem/entities/sousitem.entity';
import { Objetrepere } from 'src/objetrepere/entities/objetrepere.entity';
import { Itemsave } from 'src/itemsave/entities/itemsave.entity';
import { Orsave } from 'src/orsave/entities/orsave.entity';
import { Sousitemsave } from 'src/sousitemsave/entities/sousitemsave.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Sousitem, Sousitemsave, Item, Itemsave, Objetrepere, Orsave])],
  controllers: [ServiceAccueilController],
  providers: [ServiceAccueilService]
})
export class ServiceAccueilModule {}
