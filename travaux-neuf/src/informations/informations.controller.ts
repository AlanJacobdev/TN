import { Controller, Get, Post, Body, Patch, Param, Delete, Put} from '@nestjs/common';
import { InformationsService } from './informations.service';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';

/**
 * Entité controllant l'ensemble des requêtes commençant par informations (ex: localhost/informations/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('informations')
export class InformationsController {
  constructor(private readonly informationsService: InformationsService) {}

  @Post()
  create(@Body() createInformationDto: CreateInformationDto) {
    return this.informationsService.create(createInformationDto);
  }

  @Get()
  findAll() {
    return this.informationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.informationsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateInformationDto: UpdateInformationDto) {
    return this.informationsService.update(+id, updateInformationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.informationsService.remove(+id);
  }
}


