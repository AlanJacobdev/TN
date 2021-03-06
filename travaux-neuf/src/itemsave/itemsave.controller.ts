import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
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
    return this.itemsaveService.findById(id);
  }

  @Get(':id/:date')
  findOne(@Param('id') id: string, @Param('date') date: Date) {
    return this.itemsaveService.findOne(id, date);
  }

  @Delete(':id/:date')
  remove(@Param('id') id: string, @Param('date') date: Date) {
    return this.itemsaveService.remove(id, date);
  }
}
