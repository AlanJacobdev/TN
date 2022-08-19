import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtKey } from './constants';
import { LocalStrategy } from './strategy/local.strategy';
import { AADStrategy } from './strategy/AAD.strategy';

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
  imports : [UtilisateurModule,
    JwtModule.register({
      secret: jwtKey.secret,
      signOptions: { expiresIn: '30s' },
      
    }),],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, AADStrategy],
  exports:[AuthService, AADStrategy]
})
export class AuthModule {}
