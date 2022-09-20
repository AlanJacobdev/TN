import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SousitemsaveService } from './sousitemsave.service';
import { CreateSousitemsaveDto } from './dto/create-sousitemsave.dto';
import { UpdateSousitemsaveDto } from './dto/update-sousitemsave.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

/**
 * Entité controllant l'ensemble des requêtes commençant par sousitemsave (ex: localhost/sousitemsave/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('sousitemsave')
export class SousitemsaveController {
  constructor(private readonly sousitemsaveService: SousitemsaveService) {}

    /**
   * Création d'un sous item sauvegardé
   * @param createSousitemsaveDto : Informations utiles à la création
   * @returns Structure du nouveau sous item sauvegardé
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSousitemsaveDto: CreateSousitemsaveDto) {
    return this.sousitemsaveService.create(createSousitemsaveDto);
  }

    /**
   * Retourne l'ensemble des sous item sauvegardé
   * @returns Liste des sous items sauvegardé existants
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.sousitemsaveService.findAll();
  }

    /**
   * Retourne un sous item sauvegardé
   * @param id : Identifiant su sous item sauvegardé
   * @param date : Date de création
   * @returns Structure du sous item sauvegardé ou undefined
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/:date')
  findOne(@Param('id') id: string, @Param('date') date: Date) {
    return this.sousitemsaveService.findOne(id, date);
  }

    /**
   * Retourne l'ensemble des états d'un sous items sauvegardé
   * @param id : Identifiant d'un sous item sauvegardé
   * @returns Liste des différents états d'un sous items sauvegardé
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.sousitemsaveService.findById(id);
  }

    /**
   * Supprime un état d'un sous items sauvegardé
   * @param id : Identifiant d'un sous item sauvegardé
   * @param date : Date de création
   * @returns Message de validation ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id/:date')
  remove(@Param('id') id: string, @Param('date') date: Date) {
    return this.sousitemsaveService.remove(id, date);
  }
}
