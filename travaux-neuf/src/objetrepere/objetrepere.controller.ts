import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Request, UseGuards } from '@nestjs/common';
import { ObjetrepereService } from './objetrepere.service';
import { CreateObjetrepereDto } from './dto/create-objetrepere.dto';
import { UpdateObjetrepereDto } from './dto/update-objetrepere.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

/**
 * Entité controllant l'ensemble des requêtes commençant par objetrepere (ex: localhost/objetrepere/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('objetrepere')
export class ObjetrepereController {
  constructor(private readonly objetrepereService: ObjetrepereService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createObjetrepereDto: CreateObjetrepereDto) {
    return this.objetrepereService.create(createObjetrepereDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create/createMultipleObject')
  createMultipleObject(@Body() createObjetrepereDto: CreateObjetrepereDto) {
    return this.objetrepereService.createMultipleObject(createObjetrepereDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.objetrepereService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.objetrepereService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getORByNU/:nu')
  getORByNU(@Param('nu') nu: string){
    return this.objetrepereService.getORByNU(nu);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getORByAtelier/:id')
  getORByAtelier(@Param('id') id: string){
    return this.objetrepereService.getORByAtelier(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getORByAtelierForOneUser/:atelier/:user')
  getORByAtelierForOneUser(@Param('atelier') atelier: string, @Param('user') user: string){
    return this.objetrepereService.getORByAtelierForOneUser(atelier, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('reservationIsPossible/:idAtelier/:start/:length')
  reservationIsPossible(@Param('idAtelier') idAtelier: string, @Param('start') start: string, @Param('length') length: number){
    return this.objetrepereService.reservationIsPossible(idAtelier, start, length);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getRangeToCreateOR/:idAtelier/:startIteration/:bookOR/:isForward')
  getRangeToCreateOR(@Param('idAtelier') idAtelier: string, @Param('startIteration') startIteration: number, @Param('bookOR') bookOR: number, @Param('isForward') isForward: boolean){
    return this.objetrepereService.getRangeToCreateOR(idAtelier, startIteration, bookOR, isForward);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getRangeToCreateOR/:idAtelier/:startIteration/:bookOR')
  getRangeToCreateORWithoutWay(@Param('idAtelier') idAtelier: string, @Param('startIteration') startIteration: number, @Param('bookOR') bookOR: number){
    return this.objetrepereService.getRangeToCreateOR(idAtelier, startIteration, bookOR);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAllNUAndORByAtelier/:atelier')
  getAllNUAndORByAtelier(@Param('atelier') id: string){
    return this.objetrepereService.getAllNUAndORByAtelier(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history/:id')
  getHistory(@Param('id') id: string){
    return this.objetrepereService.getHistory(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getTypeOfItemsForOR/:Atelier')
  getTypeOfItemsForOR(@Param('Atelier') atelier: string){
    return this.objetrepereService.getTypeOfItemsForOR(atelier);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateObjetrepereDto: UpdateObjetrepereDto) {
    return this.objetrepereService.update(id, updateObjetrepereDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user : string) {
    return this.objetrepereService.remove(id, user);
  }
}
