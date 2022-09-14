import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';
import { DescriptionService } from './description.service';
import { CreateDescriptionDto } from './dto/create-description.dto';
import { UpdateDescriptionDto } from './dto/update-description.dto';

/**
 * Entité controllant l'ensemble des requêtes commençant par atelier (ex: localhost/atelier/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('description')
export class DescriptionController {
  constructor(private readonly descriptionService: DescriptionService) {}

  /**
   * Route creant une description
   * @param createDescriptionDto : Structure de la description
   * @returns Nouvelle description ou error
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDescriptionDto: CreateDescriptionDto) {
    return this.descriptionService.create(createDescriptionDto);
  }

  /**
   * Route retournant une description en fonction de son identifiant
   * @param id : Identifiant de la description cherché
   * @returns Structure de la description ou undefined
   */
  @UseGuards(JwtAuthGuard)
  @Get('findById/:id')
  findOne(@Param('id') id: string) {
    return this.descriptionService.findOneByID(+id);
  }

  /**
   * Route retournant une description dont le lien correspond à celui en paramètre
   * @param lien : Url ou phrase descriptive
   * @returns Structure de la description ou undefined
   */
  @UseGuards(JwtAuthGuard)
  @Get('findByLien/:lien')
  findOneByLien(@Param('lien') lien: string) {
    return this.descriptionService.findOneByLien(lien);
  }

  /**
   * Route modifiant une description
   * @param id : Identifiant de la description 
   * @param updateDescriptionDto : Structure de la description modifiée avec les informations a modifier
   * @returns Strcture de la description modifiée (avec l'ensemble des champs)
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateDescriptionDto: UpdateDescriptionDto) {
    return this.descriptionService.update(+id, updateDescriptionDto);
  }

  /**
   * Route supprimant une description 
   * @param id : Identifiant de la description
   * @returns Message de validation ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.descriptionService.remove(+id);
  }
}
