import { Module } from '@nestjs/common';
import { ServiceSuppressionService } from './service-suppression.service';
import { ServiceSuppressionController } from './service-suppression.controller';
import { SousitemModule } from 'src/sousitem/sousitem.module';
import { ItemModule } from 'src/item/item.module';
import { ObjetrepereModule } from 'src/objetrepere/objetrepere.module';
import { ParametreModule } from 'src/parametre/parametre.module';
import { ItemsaveModule } from 'src/itemsave/itemsave.module';
import { SousitemsaveModule } from 'src/sousitemsave/sousitemsave.module';

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
  imports : [SousitemModule, ItemModule, ObjetrepereModule, ParametreModule, ItemsaveModule, SousitemsaveModule],
  controllers: [ServiceSuppressionController],
  providers: [ServiceSuppressionService],
  exports : [ServiceSuppressionService]
})
export class ServiceSuppressionModule {}
