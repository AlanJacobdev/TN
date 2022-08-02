import { Module } from '@nestjs/common';
import { DescriptionService } from './description.service';
import { DescriptionController } from './description.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Description } from './entities/description.entity';

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
  imports : [TypeOrmModule.forFeature([Description])],
  controllers: [DescriptionController],
  providers: [DescriptionService],
  exports : [DescriptionService]
})

export class DescriptionModule {


}
