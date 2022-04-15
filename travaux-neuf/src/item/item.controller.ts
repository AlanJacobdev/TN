import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @Get('history/:id')
  getHistory(@Param('id') id: string){
    return this.itemService.getHistory(id);
  }

  @Get('getItemByOR/:id')
  getItemByOR(@Param('id') id: string){
    return this.itemService.getItemByOR(id);
  }


  @Get('getItemFromOrAndDispo/:id/:type')
  getItemFromOrAndDispo(@Param('id') id: string, @Param('type') type: string){
    return this.itemService.getItemFromOrAndDispo(id, type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Get('getTypeOfItemsOfOR/:id')
  getTypeOfItemsOfOR(@Param('id') id: string) {
    return this.itemService.getTypeOfItemsOfOR(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user : string) {
    return this.itemService.remove(id, user);
  }
}
