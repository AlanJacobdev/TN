import { Module } from '@nestjs/common';
import { DemandeAdminTraiteeService } from './demande-admin-traitee.service';
import { DemandeAdminTraiteeController } from './demande-admin-traitee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandeAdminTraitee } from './entities/demande-admin-traitee.entity';
import { OrsaveModule } from 'src/orsave/orsave.module';
import { ItemsaveModule } from 'src/itemsave/itemsave.module';
import { SousitemsaveModule } from 'src/sousitemsave/sousitemsave.module';
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
  imports: [TypeOrmModule.forFeature([DemandeAdminTraitee]), OrsaveModule, ItemsaveModule, SousitemsaveModule, UtilisateurModule],
  controllers: [DemandeAdminTraiteeController],
  providers: [DemandeAdminTraiteeService],
  exports: [DemandeAdminTraiteeService]
})
export class DemandeAdminTraiteeModule {}
