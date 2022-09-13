import { forwardRef, Module } from '@nestjs/common';
import { SousitemsaveService } from './sousitemsave.service';
import { SousitemsaveController } from './sousitemsave.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sousitemsave } from './entities/sousitemsave.entity';
import { Sousitem } from 'src/sousitem/entities/sousitem.entity';
import { SousitemModule } from 'src/sousitem/sousitem.module';
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

  imports : [TypeOrmModule.forFeature([Sousitemsave, Sousitem]), forwardRef(() => SousitemModule)],
  controllers: [SousitemsaveController],
  providers: [SousitemsaveService, ConfigService],
  exports : [SousitemsaveService]
})
export class SousitemsaveModule {}
