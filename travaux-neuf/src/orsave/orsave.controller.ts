import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrsaveService } from './orsave.service';
import { CreateOrsaveDto } from './dto/create-orsave.dto';
import { UpdateOrsaveDto } from './dto/update-orsave.dto';

@Controller('orsave')
export class OrsaveController {
  constructor(private readonly orsaveService: OrsaveService) {}

  @Post()
  create(@Body() createOrsaveDto: CreateOrsaveDto) {
    return this.orsaveService.create(createOrsaveDto);
  }

  @Get()
  findAll() {
    return this.orsaveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orsaveService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrsaveDto: UpdateOrsaveDto) {
    return this.orsaveService.update(+id, updateOrsaveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orsaveService.remove(+id);
  }
}
