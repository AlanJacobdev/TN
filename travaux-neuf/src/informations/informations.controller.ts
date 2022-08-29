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

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createInformationDto: CreateInformationDto) {
    return this.informationsService.create(createInformationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.informationsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.informationsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateInformationDto: UpdateInformationDto) {
    return this.informationsService.update(+id, updateInformationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.informationsService.remove(+id);
  }
}


