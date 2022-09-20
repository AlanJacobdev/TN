import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { TypeobjetService } from './typeobjet.service';
import { CreateTypeobjetDto } from './dto/create-typeobjet.dto';
import { UpdateTypeobjetDto } from './dto/update-typeobjet.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

/**
 * Entité controllant l'ensemble des requêtes commençant par typeobjet (ex: localhost/typeobjet/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('typeobjet')
export class TypeobjetController {
  constructor(private readonly typeobjetService: TypeobjetService) {}

    /**
   * Creation d'un type d'objet
   * @param createTypeobjetDto : Informations utiles à la création
   * @returns Structure du nouveau type d'objet ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTypeobjetDto: CreateTypeobjetDto) {
    return this.typeobjetService.create(createTypeobjetDto);
  }

    /**
   * Retourne l'ensemble des types d'objet existants
   * @returns 
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.typeobjetService.findAll();
  }

    /**
   * Retourne l'ensemble des type d'objet actifs
   * @returns 
   */
  @UseGuards(JwtAuthGuard)
  @Get('getAll/isActif')
  findAllTypeOActif(){
    return this.typeobjetService.findAllTypeOActif();
  }

    /**
   * Retourne un type d'objet 
   * @param id : Identifiant du type d'objet
   * @returns Structure du type d'objet ou undefined
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeobjetService.findOne(id);
  }

    /**
   * Modification d'un type d'objet
   * @param id : Identifiant du type d'objet
   * @param updateTypeobjetDto : Information a modifier
   * @returns Structure du type d'objet modifié ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTypeobjetDto: UpdateTypeobjetDto) {
    return this.typeobjetService.update(id, updateTypeobjetDto);
  }

    /**
   * Supprime un type d'objet
   * @param id : Identifiant du type d'objet
   * @returns Message de validation ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeobjetService.remove(id);
  }
}
