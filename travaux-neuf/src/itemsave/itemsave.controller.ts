import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemsaveService } from './itemsave.service';
import { CreateItemsaveDto } from './dto/create-itemsave.dto';
import { UpdateItemsaveDto } from './dto/update-itemsave.dto';

@Controller('itemsave')
export class ItemsaveController {
  constructor(private readonly itemsaveService: ItemsaveService) {}

  @Post()
  create(@Body() createItemsaveDto: CreateItemsaveDto) {
    return this.itemsaveService.create(createItemsaveDto);
  }

  @Get()
  findAll() {
    return this.itemsaveService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.itemsaveService.findById(+id);
  }

  @Get(':id/:date/:heure')
  findOne(@Param('id') id: string, @Param('id') date: Date, @Param('id') heure: Date) {
    return this.itemsaveService.findOne(+id, date, heure);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemsaveDto: UpdateItemsaveDto) {
    return this.itemsaveService.update(+id, updateItemsaveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsaveService.remove(+id);
  }
}
