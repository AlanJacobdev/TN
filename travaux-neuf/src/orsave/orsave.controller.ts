import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrsaveService } from './orsave.service';
import { CreateOrsaveDto } from './dto/create-orsave.dto';
import { UpdateOrsaveDto } from './dto/update-orsave.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

/**
 * Entité controllant l'ensemble des requêtes commençant par orsave (ex: localhost/orsave/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('orsave')
export class OrsaveController {
  constructor(private readonly orsaveService: OrsaveService) {}

  /**
   * Route créant un objet repère sauvegardé
   * @param createOrsaveDto : Informations utiles à la création de l'objet repère sauvegardé
   * @returns Structure du nouvel objet repère sauvegardé
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createOrsaveDto: CreateOrsaveDto) {
    return this.orsaveService.create(createOrsaveDto);
  }

  /**
   * Route retournant l'ensemble des objet repère sauvegardé
   * @returns Liste des objet repères sauvegardés existant
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.orsaveService.findAll();
  }

  /**
   * Route retournant un objet repère 
   * @param id : Identifiant de l'objet repère
   * @returns Structure de l'objet repère sauvegardé recherché ou undefined
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.orsaveService.findById(id);
  }

  /**
   * Route recherchant un objet repère en fonction de sa date de création ainsi que de son identifiant
   * @param id : Identifiant de l'objet repère sauvegardé
   * @param date : Date de création
   * @returns Structure de l'objet repère ou undefined
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/:date')
  findOne(@Param('id') id: string, @Param('date') date: Date) {
    return this.orsaveService.findOne(id, date);
  }

  /**
   * Route supprimant un objet repère sauvegardé en fonction de son identifiant et sa date de création
   * @param id : Identifiant de l'objet repère sauvegardé
   * @param date : Date de création 
   * @returns Message de validation ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id/:date')
  remove(@Param('id') id: string, @Param('date') date: Date) {
    return this.orsaveService.remove(id, date);
  }
}
