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

  @UseGuards(JwtAuthGuard)
  @Get('recopyItemFromObjetRepere/:id/:nu')
  recopyItemFromObjetRepere(@Param('id') id: string, @Param('nu') nu :string) {
    return this.serviceRecopieService.recopyItemFromObjetRepere(id,nu);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/recopySousItemFromItem/:id/:nu/:profil')
  recopySousItemFromItem(@Param('id') id :string, @Param('nu') nu : string, @Param('profil') profil : string){
    return this.serviceRecopieService.recopySousItemFromItem(id,nu,profil);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('/recopyOneItemFromOR/:idOr/:idItem/:nu/:profil')
  recopyOneItemFromOR(@Param('idOr') idOr :string, @Param('idItem') idItem :string, @Param('nu') nu : string, @Param('profil') profil :string){
    return this.serviceRecopieService.recopyOneItemFromOR(idOr, idItem, nu, profil);
  }

  // @Get('/recopyOneSousItemFromItem/:idItem/:idSousItem/:nu')
  // recopyOneSousItemFromItem(@Param('idItem') idItem :string, @Param('idSousItem') idSousItem : string, @Param('nu') nu : string ){
  //   return this.serviceRecopieService.recopyOneSousItemFromItem(idItem, idSousItem, nu);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('/recopySpecificItemFromOR/:idOr/:NU/:profil')
  recopySpecificItemFromOR(@Param('idOr') idOr :string, @Param('NU') NU :string, @Body() itemsRecopie: recopieItem[], @Param('profil') profil :string){
    return this.serviceRecopieService.recopySpecificItemFromOR(idOr, NU,itemsRecopie, profil);
  }


}
