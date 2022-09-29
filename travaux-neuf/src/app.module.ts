import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObjetrepereModule } from './objetrepere/objetrepere.module';
import { TypeobjetrepereModule } from './typeobjetrepere/typeobjetrepere.module';
import { NumerouniqueModule } from './numerounique/numerounique.module';
import { AtelierModule } from './atelier/atelier.module';
import { OrsaveModule } from './orsave/orsave.module';
import { TypeobjetModule } from './typeobjet/typeobjet.module';
import { ItemModule } from './item/item.module';
import { ItemsaveModule } from './itemsave/itemsave.module';
import { SousitemModule } from './sousitem/sousitem.module';
import { SousitemsaveModule } from './sousitemsave/sousitemsave.module';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { ConfigModule } from '@nestjs/config';
import { ServiceRecopieModule } from './service-recopie/service-recopie.module';
import { DescriptionModule } from './description/description.module';
import { DemandeAdminModule } from './demande-admin/demande-admin.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config';
import { PassportModule } from '@nestjs/passport';
import { NbDemandeGateway } from './demande-admin/gateway/nb-demande.gateway';
import { ServiceAccueilModule } from './service-accueil/service-accueil.module';
import { ParametreModule } from './parametre/parametre.module';
import { DemandeAdminTraiteeModule } from './demande-admin-traitee/demande-admin-traitee.module';
import { InformationsModule } from './informations/informations.module';
import { ServiceSuppressionModule } from './service-suppression/service-suppression.module';
import { DocumentModule } from './document/document.module';
import { RoleModule } from './role/role.module';
import { ServiceExportationModule } from './service-exportation/service-exportation.module';
import { ExportationModule } from './exportation/exportation.module';

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
  imports: [TypeOrmModule.forRoot(config), ObjetrepereModule, TypeobjetrepereModule, NumerouniqueModule, AtelierModule, OrsaveModule, TypeobjetModule, ItemModule, ItemsaveModule, SousitemModule, SousitemsaveModule, UtilisateurModule,
  ConfigModule.forRoot({
    isGlobal: true,
    load:[configuration]
  }),
  ServiceRecopieModule,
  DescriptionModule,
  DemandeAdminModule,
  ServiceSuppressionModule,
  AuthModule,
  PassportModule,
  ServiceAccueilModule,
  ParametreModule,
  DemandeAdminTraiteeModule,
  InformationsModule,
  DocumentModule,
  RoleModule,
  ServiceExportationModule,
  ExportationModule
  ],
  controllers: [AppController],
  providers: [AppService, NbDemandeGateway],
})
export class AppModule {}
