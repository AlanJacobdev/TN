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

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDescriptionDto: CreateDescriptionDto) {
    return this.descriptionService.create(createDescriptionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('findById/:id')
  findOne(@Param('id') id: string) {
    return this.descriptionService.findOneByID(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('findByLien/:lien')
  findOneByLien(@Param('lien') lien: string) {
    return this.descriptionService.findOneByLien(lien);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateDescriptionDto: UpdateDescriptionDto) {
    return this.descriptionService.update(+id, updateDescriptionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.descriptionService.remove(+id);
  }
}
