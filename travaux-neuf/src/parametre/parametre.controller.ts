import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ParametreService } from './parametre.service';
import { CreateParametreDto } from './dto/create-parametre.dto';
import { UpdateParametreDto } from './dto/update-parametre.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

/**
 * Entité controllant l'ensemble des requêtes commençant par parametre (ex: localhost/parametre/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('parametre')
export class ParametreController {
  constructor(private readonly parametreService: ParametreService) {}

  /**
   * Route créant un paramètre
   * @param createParametreDto : Informations utiles à la création du paramètre
   * @returns Structure du nouveau paramètre
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createParametreDto: CreateParametreDto) {
    return this.parametreService.create(createParametreDto);
  }

  /**
   * Route retournant l'ensemble des paramètres
   * @returns Liste des paramètres existant
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.parametreService.findAll();
  }

  /**
   * Route recherchant un paramètre par son libelle 
   * @param libelle : Libelle du paramètre recherché
   * @returns Structure du paramètre ou undefined
   */
  @UseGuards(JwtAuthGuard)
  @Get(':libelle')
  findOne(@Param('libelle') libelle: string) {
    return this.parametreService.findOne(libelle);
  }

  /**
   * Route modifiant un paramètre
   * @param libelle : Libelle du paramètre
   * @param updateParametreDto : Informations a modifier
   * @returns Structure du paramètre modifié ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Put('/updateEmail/:libelle')
  updateEmail(@Param('libelle') libelle: string, @Body() updateParametreDto: UpdateParametreDto) {
    return this.parametreService.updateEmail(libelle, updateParametreDto);
  }

  /**
   * Route modifiant la limite d'heure de suppression
   * @param libelle : Libelle du paramètre
   * @param updateParametreDto : Informations a modifier
   * @returns Structure du paramètre modifié ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Put('/updateHeure/:libelle')
  updateHeure(@Param('libelle') libelle: string, @Body() updateParametreDto: UpdateParametreDto) {
    return this.parametreService.updateHeure(libelle, updateParametreDto);
  }


}
