import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SousitemsaveService } from './sousitemsave.service';
import { CreateSousitemsaveDto } from './dto/create-sousitemsave.dto';
import { UpdateSousitemsaveDto } from './dto/update-sousitemsave.dto';

@Controller('sousitemsave')
export class SousitemsaveController {
  constructor(private readonly sousitemsaveService: SousitemsaveService) {}

  @Post()
  create(@Body() createSousitemsaveDto: CreateSousitemsaveDto) {
    return this.sousitemsaveService.create(createSousitemsaveDto);
  }

  @Get()
  findAll() {
    return this.sousitemsaveService.findAll();
  }

  @Get(':id/:date')
  findOne(@Param('id') id: string, @Param('date') date: Date) {
    return this.sousitemsaveService.findOne(id, date);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.sousitemsaveService.findById(id);
  }

  @Delete(':id/:date')
  remove(@Param('id') id: string, @Param('date') date: Date) {
    return this.sousitemsaveService.remove(id, date);
  }
}
