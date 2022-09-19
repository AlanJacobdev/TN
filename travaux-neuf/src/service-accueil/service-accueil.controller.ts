import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';
import { ServiceAccueilService } from './service-accueil.service';

/**
 * Entité controllant l'ensemble des requêtes commençant par service-accueil (ex: localhost/service-accueil/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('service-accueil')
export class ServiceAccueilController {
  constructor(private readonly serviceAccueilService: ServiceAccueilService) {}

  /**
   * Route retournant l'ensemble des activités pour une période donnée
   * @param start : 1er lundi du mois affiché (peut être du mois précedent)
   * @param end : Dernier dimanche du mois (peut être du mois suivant)
   * @returns Liste des activités pour la période donnée
   */
  @UseGuards(JwtAuthGuard)
  @Get('getNumberOfActivityForEachDay/:start/:end')
  getNumberOfActivityForEachDay(@Param('start') start: string, @Param('end') end: string) {
    return this.serviceAccueilService.getNumberOfActivityForEachDay(start, end);
  }

  /**
   * Route retournant l'ensemble des activités pour une période donnée et pour un utilisateur 
   * @param start : 1er lundi du mois affiché (peut être du mois précedent)
   * @param end : Dernier dimanche du mois (peut être du mois suivant)
   * @param login : Identifiant de l'utilisateur faisant la requête (si non administrateur)
   * @returns Liste des activités d'un utilisateur sur une periode
   */
  @UseGuards(JwtAuthGuard)
  @Get('getNumberOfActivityForEachDay/:start/:end/:login')
  getNumberOfMyActivityForEachDay(@Param('start') start: string, @Param('end') end: string, @Param('login') login: string) {
    return this.serviceAccueilService.getNumberOfActivityForEachDay(start, end, login );
  }

  /**
   * Route retournant l'ensemble des activités d'un jour 
   * @param date : Date du jour
   * @returns Liste des activités du jour 
   */
  @UseGuards(JwtAuthGuard)
  @Get('getHistoryOfOneDay/:date')
  getHistoryOfOneDay(@Param('date') date: string) {
    return this.serviceAccueilService.getHistoryOfOneDay(date);
  }

  /**
   * Route retournant l'ensemble des activités d'un jour pour un utilisateur
   * @param date : Date du jour
   * @param login : Identifiant de l'utilisateur à l'origine de la requête (si non administrateur)
   * @returns Liste des activités d'un utilisateur pour un jour
   */
  @UseGuards(JwtAuthGuard)
  @Get('getHistoryOfOneDay/:date/:login')
  getMyHistoryOfOneDay(@Param('date') date: string, @Param('login') login: string) {
    return this.serviceAccueilService.getHistoryOfOneDay(date,login);
  }
  
}
