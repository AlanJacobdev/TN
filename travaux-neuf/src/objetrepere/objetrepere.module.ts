import { forwardRef, Module } from '@nestjs/common';
import { ObjetrepereService } from './objetrepere.service';
import { ObjetrepereController } from './objetrepere.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Objetrepere } from './entities/objetrepere.entity';
import { Typeobjetrepere } from 'src/typeobjetrepere/entities/typeobjetrepere.entity';
import { Numerounique } from 'src/numerounique/entities/numerounique.entity';
import { Atelier } from 'src/atelier/entities/atelier.entity';
import { NumerouniqueModule } from 'src/numerounique/numerounique.module';
import { TypeobjetrepereModule } from 'src/typeobjetrepere/typeobjetrepere.module';
import { OrsaveModule } from 'src/orsave/orsave.module';
import { DescriptionModule } from 'src/description/description.module';
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';
import { EditOrGateway } from './gateway/edit-or.gateway';
import { ItemModule } from 'src/item/item.module';
import { SousitemModule } from 'src/sousitem/sousitem.module';

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
  imports : [TypeOrmModule.forFeature([Objetrepere, Typeobjetrepere, Numerounique, Atelier]), NumerouniqueModule, TypeobjetrepereModule, forwardRef(() =>OrsaveModule), DescriptionModule, UtilisateurModule, ItemModule, SousitemModule] ,
  controllers: [ObjetrepereController],
  providers: [ObjetrepereService, EditOrGateway],
  exports : [ObjetrepereService]
})
export class ObjetrepereModule {}
