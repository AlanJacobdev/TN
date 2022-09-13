import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { profile } from 'console';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';
import { AtelierService } from './atelier.service';
import { CreateAtelierDto } from './dto/create-atelier.dto';
import { UpdateAtelierDto } from './dto/update-atelier.dto';


/**
 * Entité controllant l'ensemble des requêtes commençant par atelier (ex: localhost/atelier/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('atelier')
export class AtelierController {
  constructor(private readonly atelierService: AtelierService) {}

  /**
   * Route destinée à la création d'un atelier
   * @param createAtelierDto Structure attendue pour la création de l'atelier
   * @returns Nouvel atelier ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAtelierDto: CreateAtelierDto) {
    return this.atelierService.create(createAtelierDto);
  }

  /**
   * Route retournant l'ensemble des ateliers existant
   * @returns Liste des ateliers existants
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.atelierService.findAll();
  }

  /**
   * Route retournant l'ensemble des ateliers actifs
   * @returns Liste des ateliers actifs
   */
  @UseGuards(JwtAuthGuard)
  @Get('/getAll/isActif')
  findAllAteliersActifAll() {
    return this.atelierService.findAllAteliersActif();
  }

  /**
   * Route récupérant l'ensemble des ateliers autorisés pour un utilisateur donné
   * @param profil : Profil de l'utilisateur
   * @returns Liste des ateliers autorisés pour l'utilisateur
   */
  @UseGuards(JwtAuthGuard)
  @Get('/findAllAteliersActifForUser/:profil')
  findAllAteliersActifForUser(@Param('profil') profil: string) {
    return this.atelierService.findAllAteliersActifForUser(profil);
  }

  /**
   * Route retournant l'atelier dont l'identifiant est égale à id
   * @param id : Identifiant de l'atelier
   * @returns Structure de l'atelier ou undefined 
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atelierService.findOne(id);
  }

  /**
   * Route mettant à jour un atelier
   * @param id : Identifiant de l'atelier
   * @param updateAtelierDto : Structure de modification de l'atelier
   * @returns Structure complète de l'atelier mise à jour
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateAtelierDto: UpdateAtelierDto) {
    return this.atelierService.update(id, updateAtelierDto);
  }

  /**
   * Route supprimant un atelier en fonction de son identifiant
   * @param id : Identifiant de l'atelier
   * @returns Message de confirmation ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.atelierService.remove(id);
  }
}
