import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards} from '@nestjs/common';
import { InformationsService } from './informations.service';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

/**
 * Entité controllant l'ensemble des requêtes commençant par informations (ex: localhost/informations/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('informations')
export class InformationsController {
  constructor(private readonly informationsService: InformationsService) {}

  /**
   * Route créant une information 
   * @param createInformationDto : Structure de l'information a creer
   * @returns Nouvelle information ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createInformationDto: CreateInformationDto) {
    return this.informationsService.create(createInformationDto);
  }

  /**
   * Route retournant l'ensemble des informations
   * @returns Liste des informations existantes
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.informationsService.findAll();
  }

  /**
   * Route retournant une information
   * @param id : Identification de l'information
   * @returns Structure de l'information ou undefined
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.informationsService.findOne(+id);
  }

  /**
   * Route modifiant une information
   * @param id : Identifiant de l'information
   * @param updateInformationDto : Structure des informations a modifier
   * @returns Structure de l'information modifié
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateInformationDto: UpdateInformationDto) {
    return this.informationsService.update(+id, updateInformationDto);
  }

  /**
   * Route supprimant une information
   * @param id  : Identifiant de l'information
   * @returns Message de validation ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.informationsService.remove(+id);
  }
}


