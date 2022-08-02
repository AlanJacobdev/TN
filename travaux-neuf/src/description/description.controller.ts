import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
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

  @Post()
  create(@Body() createDescriptionDto: CreateDescriptionDto) {
    return this.descriptionService.create(createDescriptionDto);
  }

  @Get('findById/:id')
  findOne(@Param('id') id: string) {
    return this.descriptionService.findOneByID(+id);
  }

  @Get('findByLien/:lien')
  findOneByLien(@Param('lien') lien: string) {
    return this.descriptionService.findOneByLien(lien);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDescriptionDto: UpdateDescriptionDto) {
    return this.descriptionService.update(+id, updateDescriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.descriptionService.remove(+id);
  }
}
