import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';
import { DroitService } from './droit.service';
import { CreateDroitDto } from './dto/create-droit.dto';
import { UpdateDroitDto } from './dto/update-droit.dto';

@Controller('droit')
export class DroitController {
  constructor(private readonly droitService: DroitService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDroitDto: CreateDroitDto) {
    return this.droitService.create(createDroitDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.droitService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.droitService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateDroitDto: UpdateDroitDto) {
    return this.droitService.update(id, updateDroitDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.droitService.remove(id);
  }
}
