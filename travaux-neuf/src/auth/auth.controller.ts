import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AADAuthGuard } from './strategy/aad-auth.guard';
import { LocalAuthGuard } from './strategy/local-auth.guard';

/**
 * Entité controllant l'ensemble des requêtes commençant par auth (ex: localhost/auth)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Route gérant la connexion à l'applicatif protégé par un guard 
   * @param req 
   * @returns 
   */
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AADAuthGuard)
  @Post('test')
  async test(@Request() req) {
    return this.authService.login(req.user);
  }
  

}
