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
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';

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
  imports : [TypeOrmModule.forFeature([Objetrepere, Item, Sousitem]), ObjetrepereModule, ItemModule, SousitemModule, ExportationModule, UtilisateurModule],
  controllers: [ServiceExportationController],
  providers: [ServiceExportationService]
})
export class ServiceExportationModule {}
