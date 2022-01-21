import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
    return this.sousitemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSousitemDto: UpdateSousitemDto) {
    return this.sousitemService.update(+id, updateSousitemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sousitemService.remove(+id);
  }
}
