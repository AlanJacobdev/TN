import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ItemsaveService } from './itemsave.service';
import { CreateItemsaveDto } from './dto/create-itemsave.dto';
import { UpdateItemsaveDto } from './dto/update-itemsave.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

/**
 * Entité controllant l'ensemble des requêtes commençant par itemsave (ex: localhost/itemsave/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('itemsave')
export class ItemsaveController {
  constructor(private readonly itemsaveService: ItemsaveService) {}

  /**
   * Route créant un item sauvegardé
   * @param createItemsaveDto : Informations de l'item a sauvegarder
   * @returns Structure du nouvel item sauvegrdé ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createItemsaveDto: CreateItemsaveDto) {
    return this.itemsaveService.create(createItemsaveDto);
  }

  /**
   * Route retournant l'ensemble des items sauvegardés
   * @returns Liste des items sauvegardés existant
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.itemsaveService.findAll();
  }

  /**
   * Route retournant l'ensemble des états d'un identifiant d'item 
   * @param id : Identifiant de l'item
   * @returns Liste des différents état d'un identifiant d'item sauvegardé
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.itemsaveService.findById(id);
  }

  /**
   * Route retournant un item sauvegardé en fonction de son identifiant et de sa date de création
   * @param id : Identifiant de l'item sauvegardé 
   * @param date : Date de l'item sauvegardé
   * @returns : Structure de l'item ou undefined
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/:date')
  findOne(@Param('id') id: string, @Param('date') date: Date) {
    return this.itemsaveService.findOne(id, date);
  }

  /**
   * Route supprimant un item sauvegardé
   * @param id : Identifiant de l'item sauvegardé
   * @param date : Date de l'item sauvegardé
   * @returns Message de validation ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id/:date')
  remove(@Param('id') id: string, @Param('date') date: Date) {
    return this.itemsaveService.remove(id, date);
  }
}
