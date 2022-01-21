import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AtelierService } from './atelier.service';
import { CreateAtelierDto } from './dto/create-atelier.dto';
import { UpdateAtelierDto } from './dto/update-atelier.dto';

@Controller('atelier')
export class AtelierController {
  constructor(private readonly atelierService: AtelierService) {}

  @Post()
  create(@Body() createAtelierDto: CreateAtelierDto) {
    return this.atelierService.create(createAtelierDto);
  }

  @Get()
  findAll() {
    return this.atelierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atelierService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAtelierDto: UpdateAtelierDto) {
    return this.atelierService.update(+id, updateAtelierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.atelierService.remove(+id);
  }
}
