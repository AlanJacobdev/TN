import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { TypeobjetrepereService } from './typeobjetrepere.service';
import { CreateTypeobjetrepereDto } from './dto/create-typeobjetrepere.dto';
import { UpdateTypeobjetrepereDto } from './dto/update-typeobjetrepere.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

/**
 * Entité controllant l'ensemble des requêtes commençant par typeobjetrepere (ex: localhost/typeobjetrepere/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('typeobjetrepere')
export class TypeobjetrepereController {
  constructor(private readonly typeobjetrepereService: TypeobjetrepereService) {}

  /**
   * Creation d'un type d'objet repère
   * @param createTypeobjetrepereDto : informations utiles à la création du type d'objet repère
   * @returns Structure du nouveau type d'objet repère ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTypeobjetrepereDto: CreateTypeobjetrepereDto) {
    return this.typeobjetrepereService.create(createTypeobjetrepereDto);
  }

  /**
   * Retourne l'ensemble des type d'objet repère 
   * @returns Liste des type d"objet repères existants
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.typeobjetrepereService.findAll();
  }

  /**
   * Retourne l'ensemble des type d'objets répère autorisées triés par ordre croissant en fonction de leurs identifiants pour un utilisateur donné
   * @param profil : Identifiant de l'utilisateur à l'origine de la requête 
   * @returns : Liste des types d'objet repère ou [] si aucun
   */
  @UseGuards(JwtAuthGuard)
  @Get('/findAllTypeORForUser/:profil')
  findAllTypeORForUser(@Param('profil') profil: string) {
    return this.typeobjetrepereService.findAllTypeORForUser(profil);
  }

  /**
   * Retourne un type d'objet repère
   * @param id : Identifiant de l'objet repère
   * @returns Structure de l'objet repère ou undefined
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeobjetrepereService.findOne(id);
  }

  /**
   * Modification d'un type d'objet repère
   * @param id : Identifiant du type d'objet repère
   * @param updateTypeobjetrepereDto : Modification a modifier
   * @returns Structure du type d'objet repère modifié ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTypeobjetrepereDto: UpdateTypeobjetrepereDto) {
    return this.typeobjetrepereService.update(id, updateTypeobjetrepereDto);
  }

  /**
   * Suppression d'un type d'objet repère
   * @param id : Identifiant du type d'objet repère
   * @returns Message de valdiation ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeobjetrepereService.remove(id);
  }
}
