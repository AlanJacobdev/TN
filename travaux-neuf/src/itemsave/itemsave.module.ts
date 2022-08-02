import { forwardRef, Module } from '@nestjs/common';
import { ItemsaveService } from './itemsave.service';
import { ItemsaveController } from './itemsave.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Itemsave } from './entities/itemsave.entity';
import { ItemModule } from 'src/item/item.module';
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
  imports : [TypeOrmModule.forFeature([Itemsave]), forwardRef(() =>ItemModule)],
  controllers: [ItemsaveController],
  providers: [ItemsaveService, ConfigService],
  exports : [ItemsaveService]
})
export class ItemsaveModule {}
