import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';
import { deleteObject } from './interface/SuppressionInterface';
import { ServiceSuppressionService } from './service-suppression.service';

/**
 * Entité controllant l'ensemble des requêtes commençant par service-suppression (ex: localhost/service-suppression/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('service-suppression')
export class ServiceSuppressionController {
  constructor(private readonly serviceSuppressionService: ServiceSuppressionService) {}



  /**
   * Méthode de suppression réservée aux administrateur (pas de limite d'heure)
   * @param profil Identifiant de l'utilisateur à l'origine de la requête
   * @param objectToDelete Liste d'objet a supprimer
   * @returns Liste des objets avec leur status de suppression ou erreur
   */

  @UseGuards(JwtAuthGuard)
  @Delete('/deleteObjectAsAdmin/:profil')
  deleteObjectsAsAdmin(@Param('profil') profil :string, @Body() objectToDelete: deleteObject){
    return this.serviceSuppressionService.deleteObjectsAsAdmin(profil, objectToDelete);
  }



  /**
   * Supprime un lot d'objets repère (par arborescence) 
   * @param profil : Identifiant de l'utilisateur à l'origine de la requête
   * @param objectToDelete : Liste d'objets a supprimer
   * @returns Liste des objets avec leur status de suppression ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Delete('/deleteObject/:profil')
  deleteObjects(@Param('profil') profil :string, @Body() objectToDelete: deleteObject){
    return this.serviceSuppressionService.deleteObjects(profil, objectToDelete);
  }

}
