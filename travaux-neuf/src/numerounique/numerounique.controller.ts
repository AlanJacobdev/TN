import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { NumerouniqueService } from './numerounique.service';
import { CreateNumerouniqueDto } from './dto/create-numerounique.dto';
import { UpdateNumerouniqueDto } from './dto/update-numerounique.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

/**
 * Entité controllant l'ensemble des requêtes commençant par numerounique (ex: localhost/numerounique/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('numerounique')
export class NumerouniqueController {
  constructor(private readonly numerouniqueService: NumerouniqueService) {}

  /**
   * Route permettant la création d'un numéro unique
   * @param createNumerouniqueDto : Information sur le nouveau numéro unique
   * @returns Strcture du nouveau numéro unique
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createNumerouniqueDto: CreateNumerouniqueDto) {
    return this.numerouniqueService.create(createNumerouniqueDto);
  }

  /**
   * Route retournant l'ensemble des numéros uniques
   * @returns Liste des numéros uniques existants
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.numerouniqueService.findAll();
  }

  /**
   * Route retournant un numéro unique
   * @param id : Identifiant du numéro unique
   * @returns Strcture du numéro unique ou undefined
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.numerouniqueService.findOne(id);
  }

  /**
   * Route modifiant un numéro unique
   * @param id : Identifiant du numéro unique
   * @param updateNumerouniqueDto : Informations a modifier
   * @returns Nouvelle structure du numéro unique
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateNumerouniqueDto: UpdateNumerouniqueDto) {
    return this.numerouniqueService.update(id, updateNumerouniqueDto);
  }

  /**
   * Route supprimant un numéro unique
   * @param id : Identifiant du numéro unique a supprimer
   * @returns Message de validation ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.numerouniqueService.remove(id);
  }
}
