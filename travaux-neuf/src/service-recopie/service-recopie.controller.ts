import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';
import { recopieItem } from './interface/RecopieInterface';
import { ServiceRecopieService } from './service-recopie.service';

/**
 * Entité controllant l'ensemble des requêtes commençant par service-exportation (ex: localhost/service-exportation/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('service-recopie')
export class ServiceRecopieController {
  constructor(private readonly serviceRecopieService: ServiceRecopieService) {}


  /**
   * Route recopiant l'ensemble des items d'un objet sur un autre objet 
   * @param id Identifiant de l'objet parent source
   * @param nu Numéro unique de l'objet parent cible
   * @returns Liste des items du parent cible
   */
  @UseGuards(JwtAuthGuard)
  @Get('recopyItemFromObjetRepere/:id/:nu')
  recopyItemFromObjetRepere(@Param('id') id: string, @Param('nu') nu :string) {
    return this.serviceRecopieService.recopyItemFromObjetRepere(id,nu);
  }

    /**
   * Route recopiant l'ensemble des sous items d'un item sur un autre item 
   * @param id Identifiant de l'item parent source
   * @param nu Numéro unique de l'item parent cible
   * @param profil : Identifiant du profil à l'origine de la requête
   * @returns Liste des sous items du parent cible
   */
  @UseGuards(JwtAuthGuard)
  @Get('/recopySousItemFromItem/:id/:nu/:profil')
  recopySousItemFromItem(@Param('id') id :string, @Param('nu') nu : string, @Param('profil') profil : string){
    return this.serviceRecopieService.recopySousItemFromItem(id,nu,profil);
  }
  
    /**
   * Route recopiant un item lié à un objet repère
   * @param IdOR : Identifiant de l'objet repère
   * @param IdItem : Identifiant de l'item
   * @param nu : Numéro unique cible
   * @param profil : Identifiant du profil cible
   * @returns Structure du nouvel item ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Get('/recopyOneItemFromOR/:idOr/:idItem/:nu/:profil')
  recopyOneItemFromOR(@Param('idOr') idOr :string, @Param('idItem') idItem :string, @Param('nu') nu : string, @Param('profil') profil :string){
    return this.serviceRecopieService.recopyOneItemFromOR(idOr, idItem, nu, profil);
  }

  /**
   * Route recopiant une liste d'item lié à un objet repère
   * @param idOr : Identifiant de l'objet repère source
   * @param NU : Numéro unique cible
   * @param itemsRecopie : Liste d'item a recopier
   * @param profil : Identifiant de l'utilisateur à l'origine de la requête
   * @returns Message de validation ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Post('/recopySpecificItemFromOR/:idOr/:NU/:profil')
  recopySpecificItemFromOR(@Param('idOr') idOr :string, @Param('NU') NU :string, @Body() itemsRecopie: recopieItem[], @Param('profil') profil :string){
    return this.serviceRecopieService.recopySpecificItemFromOR(idOr, NU,itemsRecopie, profil);
  }
}
