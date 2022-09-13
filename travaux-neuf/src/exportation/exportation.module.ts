import { Module } from '@nestjs/common';
import { ExportationService } from './exportation.service';
import { ExportationController } from './exportation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exportation } from './entities/exportation.entity';
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';

/**
 * Entité controllant l'ensemble des requêtes commençant par atelier (ex: localhost/atelier/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */
@Module({
  imports : [TypeOrmModule.forFeature([Exportation]), UtilisateurModule],
  controllers: [ExportationController],
  providers: [ExportationService],
  exports : [ExportationService]
})
export class ExportationModule {}
