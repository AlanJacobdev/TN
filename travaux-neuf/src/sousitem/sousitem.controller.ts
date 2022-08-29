import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { SousitemService } from './sousitem.service';
import { CreateSousitemDto } from './dto/create-sousitem.dto';
import { UpdateSousitemDto } from './dto/update-sousitem.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

@Controller('sousitem')
export class SousitemController {
  constructor(private readonly sousitemService: SousitemService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSousitemDto: CreateSousitemDto) {
    return this.sousitemService.create(createSousitemDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.sousitemService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sousitemService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history/:id')
  getHistory(@Param('id') id: string){
    return this.sousitemService.getHistory(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAllTypeAvailable/:idItem')
  getAllTypeAvailable(@Param('idItem') idItem: string){
    return this.sousitemService.getAllTypeAvailable(idItem);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAllTypeAvailableAndActif/:idItem')
  getAllTypeAvailableAndActif(@Param('idItem') idItem: string){
    return this.sousitemService.getAllTypeAvailableAndActif(idItem);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getSousItemByItem/:id')
  getSousItemByItem(@Param('id') id: string){
    return this.sousitemService.getSousItemByItemAffichage(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateSousitemDto: UpdateSousitemDto) {
    return this.sousitemService.update(id, updateSousitemDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user : string) {
    return this.sousitemService.remove(id, user);
  }
}
