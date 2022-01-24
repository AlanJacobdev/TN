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

  @Get(':id/:date/:heure')
  findOne(@Param('id') id: string, @Param('date') date: Date, @Param('heure') heure: Date) {
    return this.sousitemsaveService.findOne(id, date, heure);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.sousitemsaveService.findById(id);
  }

  @Delete(':id/:date/:heure')
  remove(@Param('id') id: string, @Param('date') date: Date, @Param('heure') heure: Date) {
    return this.sousitemsaveService.remove(id, date, heure);
  }
}
