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

/**
 * Entités permettant de gérer les dépendances et relations d'une caractéristique de l'application
 * Imports : Liste l'ensemble des modules exportant des providers utiles à ce module.
 * Controllers : Liste des controlleurs devant être initialisés
 * Providers : L'ensemble des providers instanciés par l'injecteur Nest et utiles au sein de ce modules
 * Exports : Permet à d'autres modules d'accéder aux providers référencées
 * 
 * Plus d'informations : https://docs.nestjs.com/modules
 */


@Module({
  imports : [TypeOrmModule.forFeature([Objetrepere, Item, Sousitem]), ObjetrepereModule, ItemModule, SousitemModule],
  controllers: [ServiceRecopieController],
  providers: [ServiceRecopieService, ConfigService]
})
export class ServiceRecopieModule {}
