import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Entité controllant l'ensemble des requêtes commençant par atelier (ex: localhost)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Route de test
   * @returns "Hello world!"
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
