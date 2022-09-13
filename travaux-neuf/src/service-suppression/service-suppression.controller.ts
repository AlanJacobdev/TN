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

  @UseGuards(JwtAuthGuard)
  @Delete('/deleteObjectAsAdmin/:profil')
  deleteObjectsAsAdmin(@Param('profil') profil :string, @Body() itemsRecopie: deleteObject){
    return this.serviceSuppressionService.deleteObjectsAsAdmin(profil, itemsRecopie);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/deleteObject/:profil')
  deleteObjects(@Param('profil') profil :string, @Body() itemsRecopie: deleteObject){
    return this.serviceSuppressionService.deleteObjects(profil, itemsRecopie);
  }

}
