import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { DroitService } from './droit.service';
import { CreateDroitDto } from './dto/create-droit.dto';
import { UpdateDroitDto } from './dto/update-droit.dto';

@Controller('droit')
export class DroitController {
  constructor(private readonly droitService: DroitService) {}

  @Post()
  create(@Body() createDroitDto: CreateDroitDto) {
    return this.droitService.create(createDroitDto);
  }

  @Get()
  findAll() {
    return this.droitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.droitService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDroitDto: UpdateDroitDto) {
    return this.droitService.update(id, updateDroitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.droitService.remove(id);
  }
}
