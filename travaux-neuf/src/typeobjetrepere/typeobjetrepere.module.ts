import { forwardRef, Module } from '@nestjs/common';
import { TypeobjetrepereService } from './typeobjetrepere.service';
import { TypeobjetrepereController } from './typeobjetrepere.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Typeobjetrepere } from './entities/typeobjetrepere.entity';
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
  imports: [TypeOrmModule.forFeature([Typeobjetrepere]), forwardRef(() => UtilisateurModule)],
  controllers: [TypeobjetrepereController],
  providers: [TypeobjetrepereService],
  exports: [TypeobjetrepereService]
})
export class TypeobjetrepereModule {}
