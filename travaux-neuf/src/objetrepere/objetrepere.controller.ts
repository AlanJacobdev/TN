import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Request } from '@nestjs/common';
import { ObjetrepereService } from './objetrepere.service';
import { CreateObjetrepereDto } from './dto/create-objetrepere.dto';
import { UpdateObjetrepereDto } from './dto/update-objetrepere.dto';
import { Sousitem } from 'src/sousitem/entities/sousitem.entity';

@Controller('objetrepere')
export class ObjetrepereController {
  constructor(private readonly objetrepereService: ObjetrepereService) {}

  @Post()
  create(@Body() createObjetrepereDto: CreateObjetrepereDto) {
    return this.objetrepereService.create(createObjetrepereDto);
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

  @Get('getAllNUAndORByAtelier/:atelier')
  getAllNUAndORByAtelier(@Param('atelier') id: string){
    return this.objetrepereService.getAllNUAndORByAtelier(id);
  }

  @Get('history/:id')
  getHistory(@Param('id') id: string){
    return this.objetrepereService.getHistory(id);
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
