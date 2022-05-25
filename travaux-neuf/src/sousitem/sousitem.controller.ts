import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { SousitemService } from './sousitem.service';
import { CreateSousitemDto } from './dto/create-sousitem.dto';
import { UpdateSousitemDto } from './dto/update-sousitem.dto';

@Controller('sousitem')
export class SousitemController {
  constructor(private readonly sousitemService: SousitemService) {}

  @Post()
  create(@Body() createSousitemDto: CreateSousitemDto) {
    return this.sousitemService.create(createSousitemDto);
  }

  @Get()
  findAll() {
    return this.sousitemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sousitemService.findOne(id);
  }

  @Get('history/:id')
  getHistory(@Param('id') id: string){
    return this.sousitemService.getHistory(id);
  }

  @Get('getAllTypeAvailable/:idItem')
  getAllTypeAvailable(@Param('idItem') idItem: string){
    return this.sousitemService.getAllTypeAvailable(idItem);
  }

  @Get('getSousItemByItem/:id')
  getSousItemByItem(@Param('id') id: string){
    return this.sousitemService.getSousItemByItem(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSousitemDto: UpdateSousitemDto) {
    return this.sousitemService.update(id, updateSousitemDto);
  }

  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user : string) {
    return this.sousitemService.remove(id, user);
  }
}
