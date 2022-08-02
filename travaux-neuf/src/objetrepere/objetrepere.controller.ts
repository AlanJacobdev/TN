import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Request } from '@nestjs/common';
import { ObjetrepereService } from './objetrepere.service';
import { CreateObjetrepereDto } from './dto/create-objetrepere.dto';
import { UpdateObjetrepereDto } from './dto/update-objetrepere.dto';

/**
 * Entité controllant l'ensemble des requêtes commençant par objetrepere (ex: localhost/objetrepere/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('objetrepere')
export class ObjetrepereController {
  constructor(private readonly objetrepereService: ObjetrepereService) {}

  @Post()
  create(@Body() createObjetrepereDto: CreateObjetrepereDto) {
    return this.objetrepereService.create(createObjetrepereDto);
  }

  @Post('create/createMultipleObject')
  createMultipleObject(@Body() createObjetrepereDto: CreateObjetrepereDto) {
    return this.objetrepereService.createMultipleObject(createObjetrepereDto);
  }

  @Get()
  findAll() {
    return this.objetrepereService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.objetrepereService.findOne(id);
  }

 
  @Get('getORByNU/:nu')
  getORByNU(@Param('nu') nu: string){
    return this.objetrepereService.getORByNU(nu);
  }

  @Get('getORByAtelier/:id')
  getORByAtelier(@Param('id') id: string){
    return this.objetrepereService.getORByAtelier(id);
  }

  @Get('reservationIsPossible/:idAtelier/:start/:length')
  reservationIsPossible(@Param('idAtelier') idAtelier: string, @Param('start') start: string, @Param('length') length: number){
    return this.objetrepereService.reservationIsPossible(idAtelier, start, length);
  }

  @Get('getRangeToCreateOR/:idAtelier/:startIteration/:bookOR/:isForward')
  getRangeToCreateOR(@Param('idAtelier') idAtelier: string, @Param('startIteration') startIteration: number, @Param('bookOR') bookOR: number, @Param('isForward') isForward: boolean){
    return this.objetrepereService.getRangeToCreateOR(idAtelier, startIteration, bookOR, isForward);
  }

  @Get('getRangeToCreateOR/:idAtelier/:startIteration/:bookOR')
  getRangeToCreateORWithoutWay(@Param('idAtelier') idAtelier: string, @Param('startIteration') startIteration: number, @Param('bookOR') bookOR: number){
    return this.objetrepereService.getRangeToCreateOR(idAtelier, startIteration, bookOR);
  }

  @Get('getAllNUAndORByAtelier/:atelier')
  getAllNUAndORByAtelier(@Param('atelier') id: string){
    return this.objetrepereService.getAllNUAndORByAtelier(id);
  }

  @Get('history/:id')
  getHistory(@Param('id') id: string){
    return this.objetrepereService.getHistory(id);
  }

  @Get('getTypeOfItemsForOR/:Atelier')
  getTypeOfItemsForOR(@Param('Atelier') atelier: string){
    return this.objetrepereService.getTypeOfItemsForOR(atelier);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateObjetrepereDto: UpdateObjetrepereDto) {
    return this.objetrepereService.update(id, updateObjetrepereDto);
  }

  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user : string) {
    return this.objetrepereService.remove(id, user);
  }
}
