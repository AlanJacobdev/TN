import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

/**
 * Permet de mettre en place la stratégie pour la connexion 
 * Est utilisé par LocalAuthGuard => la méthode validate permet de valider ou non le guard
 * 
 * Plus d'informations : https://docs.nestjs.com/security/authentication#built-in-passport-guards 
 */

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    /**
   * Constructeur de la classe 
   * Injection de Repository et autres services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(private authService: AuthService) {
    super({
      usernameField: 'login',
      passwordField: 'password',
    });
  }

   /**
     * Méthode de validation (après vérification de l'existence) 
     */
  async validate(login: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(login, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
