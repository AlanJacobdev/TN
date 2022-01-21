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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sousitemsaveService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSousitemsaveDto: UpdateSousitemsaveDto) {
    return this.sousitemsaveService.update(+id, updateSousitemsaveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sousitemsaveService.remove(+id);
  }
}
