import { forwardRef, Module } from '@nestjs/common';
import { OrsaveService } from './orsave.service';
import { OrsaveController } from './orsave.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orsave } from './entities/orsave.entity';
import { Objetrepere } from 'src/objetrepere/entities/objetrepere.entity';
import { ObjetrepereModule } from 'src/objetrepere/objetrepere.module';
import { ConfigService } from '@nestjs/config';

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
  imports : [TypeOrmModule.forFeature([Orsave, Objetrepere]), forwardRef(() =>ObjetrepereModule)],
  controllers: [OrsaveController],
  providers: [OrsaveService, ConfigService],
  exports : [OrsaveService]
})
export class OrsaveModule {}
