import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ParametreService } from './parametre.service';
import { CreateParametreDto } from './dto/create-parametre.dto';
import { UpdateParametreDto } from './dto/update-parametre.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

@Controller('parametre')
export class ParametreController {
  constructor(private readonly parametreService: ParametreService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createParametreDto: CreateParametreDto) {
    return this.parametreService.create(createParametreDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.parametreService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':libelle')
  findOne(@Param('libelle') libelle: string) {
    return this.parametreService.findOne(libelle);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/updateEmail/:libelle')
  updateEmail(@Param('libelle') libelle: string, @Body() updateParametreDto: UpdateParametreDto) {
    return this.parametreService.updateEmail(libelle, updateParametreDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/updateHeure/:libelle')
  updateHeure(@Param('libelle') libelle: string, @Body() updateParametreDto: UpdateParametreDto) {
    return this.parametreService.updateHeure(libelle, updateParametreDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parametreService.remove(+id);
  }
}
