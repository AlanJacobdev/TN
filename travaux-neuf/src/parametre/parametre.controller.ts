import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ParametreService } from './parametre.service';
import { CreateParametreDto } from './dto/create-parametre.dto';
import { UpdateParametreDto } from './dto/update-parametre.dto';

@Controller('parametre')
export class ParametreController {
  constructor(private readonly parametreService: ParametreService) {}

  @Post()
  create(@Body() createParametreDto: CreateParametreDto) {
    return this.parametreService.create(createParametreDto);
  }

  @Get()
  findAll() {
    return this.parametreService.findAll();
  }

  @Get(':libelle')
  findOne(@Param('libelle') libelle: string) {
    return this.parametreService.findOne(libelle);
  }

  @Put('/updateEmail/:libelle')
  updateEmail(@Param('libelle') libelle: string, @Body() updateParametreDto: UpdateParametreDto) {
    return this.parametreService.updateEmail(libelle, updateParametreDto);
  }

  @Put('/updateHeure/:libelle')
  updateHeure(@Param('libelle') libelle: string, @Body() updateParametreDto: UpdateParametreDto) {
    return this.parametreService.updateHeure(libelle, updateParametreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parametreService.remove(+id);
  }
}
