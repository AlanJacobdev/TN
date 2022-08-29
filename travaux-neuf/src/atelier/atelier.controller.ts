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

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAtelierDto: CreateAtelierDto) {
    return this.atelierService.create(createAtelierDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.atelierService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getAll/isActif')
  findAllAteliersActifAll() {
    return this.atelierService.findAllAteliersActif();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/findAllAteliersActifForUser/:profil')
  findAllAteliersActifForUser(@Param('profil') profil: string) {
    return this.atelierService.findAllAteliersActifForUser(profil);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atelierService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateAtelierDto: UpdateAtelierDto) {
    return this.atelierService.update(id, updateAtelierDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.atelierService.remove(id);
  }
}
