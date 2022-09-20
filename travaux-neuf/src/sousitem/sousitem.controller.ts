import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { SousitemService } from './sousitem.service';
import { CreateSousitemDto } from './dto/create-sousitem.dto';
import { UpdateSousitemDto } from './dto/update-sousitem.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

/**
 * Entité controllant l'ensemble des requêtes commençant par sousitem (ex: localhost/sousitem/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('sousitem')
export class SousitemController {
  constructor(private readonly sousitemService: SousitemService) {}

/**
   * Route créant un sous item
   * @param createSousitemDto : Informations utiles à la création 
   * @returns Structure du nouveau sous item
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSousitemDto: CreateSousitemDto) {
    return this.sousitemService.create(createSousitemDto);
  }

  /**
   * Retourne l'ensemble des sous items
   * @returns Liste des sous items existant
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.sousitemService.findAll();
  }

    /**
   * Retourne un sous item 
   * @param id : Identifiant du sous item
   * @returns Structure du sous item ou undefined
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sousitemService.findOne(id);
  }

    /**
   * Retourne l'historique d'activité d'un sous item
   * @param id : Identifiant du sous item
   * @returns Liste des différent état du sous item
   */
  @UseGuards(JwtAuthGuard)
  @Get('history/:id')
  getHistory(@Param('id') id: string){
    return this.sousitemService.getHistory(id);
  }

    /**
   * Retourne les types non attribués à un sous item pour un item donné
   * @param idItem : Identifiant de l'item
   * @returns Liste des types d'objet non attribués pour un sous item
   */
  @UseGuards(JwtAuthGuard)
  @Get('getAllTypeAvailable/:idItem')
  getAllTypeAvailable(@Param('idItem') idItem: string){
    return this.sousitemService.getAllTypeAvailable(idItem);
  }

    /**
   * Retourne les types ACTIFS et non attribués à un sous item pour un item donné
   * @param idItem : Identifiant de l'item
   * @returns Liste des types d'objet ACTIF et non attribués pour un sous item
   */
  @UseGuards(JwtAuthGuard)
  @Get('getAllTypeAvailableAndActif/:idItem')
  getAllTypeAvailableAndActif(@Param('idItem') idItem: string){
    return this.sousitemService.getAllTypeAvailableAndActif(idItem);
  }

    /**
   * Recherche les sous item d'un lié à un item. Transforme l'identifiant utilisateur pour l'affichage
   * @param id : Identifiant de l'item parent
   * @returns Liste des sous items liés au parent
   */
  @UseGuards(JwtAuthGuard)
  @Get('getSousItemByItem/:id')
  getSousItemByItem(@Param('id') id: string){
    return this.sousitemService.getSousItemByItemAffichage(id);
  }

    /**
   * Modification d'un sous item
   * @param id : Identifiant du sous item recherché
   * @param updateSousitemDto : informations a modifier
   * @returns Structure du sous item modifiée ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateSousitemDto: UpdateSousitemDto) {
    return this.sousitemService.update(id, updateSousitemDto);
  }

      /**
     * Supprime un sous item
     * @param id : Identifiant du sous item
     * @param user : Identifiant de l'utilisateur à l'origine de la requête
     * @returns Message de validation ou erreur
     */
  @UseGuards(JwtAuthGuard)
  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user : string) {
    return this.sousitemService.remove(id, user);
  }
}
