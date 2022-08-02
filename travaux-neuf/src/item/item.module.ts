import { forwardRef, Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { TypeobjetModule } from 'src/typeobjet/typeobjet.module';
import { ObjetrepereModule } from 'src/objetrepere/objetrepere.module';
import { ItemsaveModule } from 'src/itemsave/itemsave.module';
import { DescriptionModule } from 'src/description/description.module';
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
  imports : [TypeOrmModule.forFeature([Item]), TypeobjetModule, forwardRef(() =>ObjetrepereModule), forwardRef(() =>ItemsaveModule), DescriptionModule, UtilisateurModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports : [ItemService]
})
export class ItemModule {}


