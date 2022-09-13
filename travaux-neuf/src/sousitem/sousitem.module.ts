import { forwardRef, Module } from '@nestjs/common';
import { SousitemService } from './sousitem.service';
import { SousitemController } from './sousitem.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sousitem } from './entities/sousitem.entity';
import { ItemModule } from 'src/item/item.module';
import { TypeobjetModule } from 'src/typeobjet/typeobjet.module';
import { SousitemsaveModule } from 'src/sousitemsave/sousitemsave.module';
import { DescriptionModule } from 'src/description/description.module';
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';
import { Item } from 'src/item/entities/item.entity';

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
  imports : [TypeOrmModule.forFeature([Sousitem, Item]), ItemModule, TypeobjetModule, forwardRef(() => SousitemsaveModule), DescriptionModule, UtilisateurModule ],
  controllers: [SousitemController],
  providers: [SousitemService],
  exports : [SousitemService]
})
export class SousitemModule {}
