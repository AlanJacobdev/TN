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
  imports : [TypeOrmModule.forFeature([Sousitem, Sousitemsave, Item, Itemsave, Objetrepere, Orsave]), UtilisateurModule],
  controllers: [ServiceAccueilController],
  providers: [ServiceAccueilService]
})
export class ServiceAccueilModule {}
