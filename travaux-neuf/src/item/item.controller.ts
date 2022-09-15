import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

/**
 * Entité controllant l'ensemble des requêtes commençant par item (ex: localhost/item/5)
 * Permet de rediriger la requete vers la fonction dédiée 
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  /**
   * Route créant un item
   * @param createItemDto : Informations du nouvel item
   * @returns Structure du nouvel item ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  /**
   * Route retournant l'ensemble des items
   * @returns Liste des items existants
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  /**
   * Route retournant l'historique d'un item
   * @param id : Identifiant de l'item recherché
   * @returns Liste des précédents état de l'item
   */
  @UseGuards(JwtAuthGuard)
  @Get('history/:id')
  getHistory(@Param('id') id: string){
    return this.itemService.getHistory(id);
  }

  /**
   * Route retournant l'ensemble des items liés à une objet repère
   * @param id : Identifiant de l'objet repère
   * @returns Liste des items dont l'identifiant du parent est id 
   */
  @UseGuards(JwtAuthGuard)
  @Get('getItemByOR/:id')
  getItemByOR(@Param('id') id: string){
    return this.itemService.getItemByORAffichage(id);
  }

  /**
   * Route retournant les items liés à un objet repère ayant un type @param type
   * @param id : Identifiant de l'objet repère
   * @param type : Type de l'item souhaité
   * @returns Liste des items correspondant aux filtres
   */
  @UseGuards(JwtAuthGuard)
  @Get('getItemFromOrAndDispo/:id/:type')
  getItemFromOrAndDispo(@Param('id') id: string, @Param('type') type: string){
    return this.itemService.getItemFromOrAndDispo(id, type);
  }

  /**
   * Route  retournant l'ensemble des items en fonction des filtres suivants (@param)
   * @param atelier : Identifiant de l'atelier souhaité
   * @param typeObjet : Type d'objet des items souhaités
   * @param objetRepere : Identifiant de l'objet repère dont dépendent les items
   * @param dateDebut : Début d'intervalle sur la dernière activité effectué sur l'item
   * @param dateFin : Fin d'intervalle sur la dernière activité effectué sur l'item
   * @param estActif : Item dont le statut actif correspond à celui passé en paramètres
   * @param estSecurite : Est un item de sécurité ou non ("Z")
   * @returns Liste des items coreepondant aux filtres
   */
  @UseGuards(JwtAuthGuard)
  @Get('getItemForExport/:atelier/:typeObjet/:objetRepere/:dateDebut/:dateFin/:estActif/:estSecurite')
  getItemForExport(@Param('atelier') atelier: string, @Param('typeObjet') typeObjet: string, @Param('objetRepere') objetRepere: string, @Param('dateDebut') dateDebut: string,
  @Param('dateFin') dateFin : string, @Param('estActif') estActif : string, @Param('estSecurite') estSecurite : string){
    return this.itemService.getItemForExport(atelier, typeObjet, objetRepere, dateDebut, dateFin, estActif, estSecurite);
  }

  /**
   * Route retournant un item
   * @param id : identifiant de l'item recherché
   * @returns Structure de l'item ou undefined
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  /**
   * Route permettant de connaître les types des items liés à un objet repère
   * @param id : identifiant de l'objet repère
   * @returns Liste des type d'objet 
   */
  @UseGuards(JwtAuthGuard)
  @Get('getTypeOfItemsOfOR/:id')
  getTypeOfItemsOfOR(@Param('id') id: string) {
    return this.itemService.getTypeOfItemsOfOR(id);
  }

  /**
   * Route modifiant un item
   * @param id : Identifiant de l'item a modifier
   * @param updateItemDto : Informations a modifier sur l'item
   * @returns Nouvelle structure de l'item
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(id, updateItemDto);
  }

  /**
   * Route supprimant un item
   * @param id : Identifiant de l'item
   * @param user : Utilisateur à l'origine de la modification
   * @returns Message de validation ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user : string) {
    return this.itemService.remove(id, user);
  }
}
