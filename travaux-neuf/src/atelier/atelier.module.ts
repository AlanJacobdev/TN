import { Module } from '@nestjs/common';
import { AtelierService } from './atelier.service';
import { AtelierController } from './atelier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Atelier } from './entities/atelier.entity';
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
  imports: [TypeOrmModule.forFeature([Atelier]), UtilisateurModule],
  controllers: [AtelierController],
  providers: [AtelierService],
  exports : [AtelierService]
})
export class AtelierModule {}
