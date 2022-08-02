import { Module } from '@nestjs/common';
import { NumerouniqueService } from './numerounique.service';
import { NumerouniqueController } from './numerounique.controller';
import { AtelierService } from 'src/atelier/atelier.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Numerounique } from './entities/numerounique.entity';
import { Atelier } from 'src/atelier/entities/atelier.entity';
import { AtelierModule } from 'src/atelier/atelier.module';

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
  imports : [ TypeOrmModule.forFeature([Numerounique, Atelier]), AtelierModule],
  controllers: [NumerouniqueController],
  providers: [NumerouniqueService],
  exports : [NumerouniqueService]
})
export class NumerouniqueModule {}
