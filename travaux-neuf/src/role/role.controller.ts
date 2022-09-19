import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

/**
 * Entité controllant l'ensemble des requêtes commençant par role (ex: localhost/role/5)
 * Permet de rediriger la requete vers la fonction dédiée 
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * Route cxréant un rôle
   * @param createRoleDto : Information utiles à la création du rôle
   * @returns Structure du nouveau rôle
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  /**
   * Route retournant l'ensemble des rôles
   * @returns Liste des rôles existant
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  /**
   * Route recherchant un rôle par son identifiant
   * @param id : Identifiant du rôle
   * @returns Structure du rôle recherché ou undefined
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  /**
   * Route modifiant un rôle 
   * @param id : Identifiant du rôle
   * @param updateRoleDto : Informations a modifier
   * @returns Structure du rôle modifié
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  /**
   * Route supprimant un rôle
   * @param id : Identifiant du rôle
   * @returns Message de validation ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
