import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Request, UseGuards } from '@nestjs/common';
import { ObjetrepereService } from './objetrepere.service';
import { CreateObjetrepereDto } from './dto/create-objetrepere.dto';
import { UpdateObjetrepereDto } from './dto/update-objetrepere.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

/**
 * Entité controllant l'ensemble des requêtes commençant par objetrepere (ex: localhost/objetrepere/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('objetrepere')
export class ObjetrepereController {
  constructor(private readonly objetrepereService: ObjetrepereService) {}

  /**
   * Route créant un objet repère
   * @param createObjetrepereDto : informations sur l'objet repère a créer
   * @returns Structure du nouvel objet repère
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createObjetrepereDto: CreateObjetrepereDto) {
    return this.objetrepereService.create(createObjetrepereDto);
  }

  /**
   * Route permettant la création de multiples objet repères
   * @param createObjetrepereDto : Information sur les objet repère a créer 
   * @returns Message de validation ou d'erreur 
   */
  @UseGuards(JwtAuthGuard)
  @Post('create/createMultipleObject')
  createMultipleObject(@Body() createObjetrepereDto: CreateObjetrepereDto) {
    return this.objetrepereService.createMultipleObject(createObjetrepereDto);
  }

  /**
   * Route retournant l'ensemble des objets repères
   * @returns Liste des objets repères existants
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.objetrepereService.findAll();
  }


  /**
   * Route retournant un objet repère
   * @param id : Identifiant de l'objet repère
   * @returns Structure de l'objet repère ou undefined
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.objetrepereService.findOne(id);
  }

  /**
   * Route retournant l'objet repère associé à un numéro unique
   * @param nu : Identifiant du numéro unique
   * @returns Structure de l'objet repère recherché ou undefined
   */
  @UseGuards(JwtAuthGuard)
  @Get('getORByNU/:nu')
  getORByNU(@Param('nu') nu: string){
    return this.objetrepereService.getORByNU(nu);
  }

  /**
   * Route retournant l'ensemble des objet repère appartenant à un atelier
   * @param id : Identifiant de l'atelier
   * @returns Liste des objet repères liés à l'atelier
   */
  @UseGuards(JwtAuthGuard)
  @Get('getORByAtelier/:id')
  getORByAtelier(@Param('id') id: string){
    return this.objetrepereService.getORByAtelier(id);
  }

  /**
   * Route filtre et retourne les objet repères qu'un utilisateur peut voir
   * @param atelier : Identifiant de l'atelier
   * @param user : Identifiant de l'utilisateur 
   * @returns Liste des objet repères accessibles par l'utilisateur
   */
  @UseGuards(JwtAuthGuard)
  @Get('getORByAtelierForOneUser/:atelier/:user')
  getORByAtelierForOneUser(@Param('atelier') atelier: string, @Param('user') user: string){
    return this.objetrepereService.getORByAtelierForOneUser(atelier, user);
  }

  /**
   * Route vérifiant la possibilité de réserver un intervalle pour une création multiple d'objet repères
   * @param idAtelier : Identifiant de l'atelier
   * @param start : Identifiant du numéro unique de l'objet inital
   * @param length : Nombre d'objet repères supplémentaire a reserver
   * @returns Message de validation ou de refus
   */
  @UseGuards(JwtAuthGuard)
  @Get('reservationIsPossible/:idAtelier/:start/:length')
  reservationIsPossible(@Param('idAtelier') idAtelier: string, @Param('start') start: string, @Param('length') length: number){
    return this.objetrepereService.reservationIsPossible(idAtelier, start, length);
  }

  /**
   * Route permettant le déplacement de la réservation lorsqu'elle est impossible dans le cas d'un premier emplacement
   * @param Atelier : Identifiant de l'atelier
   * @param startIteration : Numero unique du début de l'interval de réservation
   * @param bookOR : Nombre d'or supplémentaire à créer
   * @param isForward : Vers l'avant
   * @returns : {status : HttpStatus, error : string} // {range : number, endIndex : string}
   */
  @UseGuards(JwtAuthGuard)
  @Get('getRangeToCreateOR/:idAtelier/:startIteration/:bookOR/:isForward')
  getRangeToCreateOR(@Param('idAtelier') idAtelier: string, @Param('startIteration') startIteration: number, @Param('bookOR') bookOR: number, @Param('isForward') isForward: boolean){
    return this.objetrepereService.getRangeToCreateOR(idAtelier, startIteration, bookOR, isForward);
  }

  /** 
   * Route permettant le déplacement de la réservation lorsqu'elle est impossible dans le cas d'un premier emplacement
   * @param Atelier : Identifiant de l'atelier
   * @param startIteration : Numero unique du début de l'interval de réservation
   * @param bookOR : Nombre d'or supplémentaire à créer
   * @returns : {status : HttpStatus, error : string} // {range : number, endIndex : string}
   */
  @UseGuards(JwtAuthGuard)
  @Get('getRangeToCreateOR/:idAtelier/:startIteration/:bookOR')
  getRangeToCreateORWithoutWay(@Param('idAtelier') idAtelier: string, @Param('startIteration') startIteration: number, @Param('bookOR') bookOR: number){
    return this.objetrepereService.getRangeToCreateOR(idAtelier, startIteration, bookOR);
  }

  /**
   * Route retournant la liste des numéros uniques d'un atelier en précisant lesquels sont déjà créés
   * @param id : Identifiant de l'atelier 
   * @returns Liste des 1000 nu complétée des OR existants
   */
  @UseGuards(JwtAuthGuard)
  @Get('getAllNUAndORByAtelier/:atelier')
  getAllNUAndORByAtelier(@Param('atelier') id: string){
    return this.objetrepereService.getAllNUAndORByAtelier(id);
  }

  /**
   * Route retournant les différents états d'un objet repère
   * @param id : Identifiant de l'objet repère
   * @returns Liste des différents état de l'objet repère
   */
  @UseGuards(JwtAuthGuard)
  @Get('history/:id')
  getHistory(@Param('id') id: string){
    return this.objetrepereService.getHistory(id);
  }

  /**
   * Route retournant l'ensemble des types d'objet d'un atelier
   * @param Atelier identifiant de l'Atelier
   * @returns Liste de tout les types d'objet repère d'un Atelier ou [] si aucun
   */
  @UseGuards(JwtAuthGuard)
  @Get('getTypeOfItemsForOR/:Atelier')
  getTypeOfItemsForOR(@Param('Atelier') atelier: string){
    return this.objetrepereService.getTypeOfItemsForOR(atelier);
  }

  /**
   * Route modifiant un objet repère
   * @param id : Identifiant de l'objet repère a modifier
   * @param updateObjetrepereDto : informations a modifier
   * @returns Nouvelle strcture de l'objet repère
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateObjetrepereDto: UpdateObjetrepereDto) {
    return this.objetrepereService.update(id, updateObjetrepereDto);
  }

  /**
   * Route supprimant un objet repère
   * @param id : Identifiant de l'objet repère
   * @param user : Identifiant de l'utilisateur
   * @returns Message de validation ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user : string) {
    return this.objetrepereService.remove(id, user);
  }
}
