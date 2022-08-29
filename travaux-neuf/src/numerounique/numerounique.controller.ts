import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { NumerouniqueService } from './numerounique.service';
import { CreateNumerouniqueDto } from './dto/create-numerounique.dto';
import { UpdateNumerouniqueDto } from './dto/update-numerounique.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

/**
 * Entité controllant l'ensemble des requêtes commençant par numerounique (ex: localhost/numerounique/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('numerounique')
export class NumerouniqueController {
  constructor(private readonly numerouniqueService: NumerouniqueService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createNumerouniqueDto: CreateNumerouniqueDto) {
    return this.numerouniqueService.create(createNumerouniqueDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.numerouniqueService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.numerouniqueService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateNumerouniqueDto: UpdateNumerouniqueDto) {
    return this.numerouniqueService.update(id, updateNumerouniqueDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.numerouniqueService.remove(id);
  }
}
