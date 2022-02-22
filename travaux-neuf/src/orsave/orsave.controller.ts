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
  findById(@Param('id') id: string) {
    return this.orsaveService.findById(id);
  }

  @Get(':id/:date')
  findOne(@Param('id') id: string, @Param('date') date: Date) {
    return this.orsaveService.findOne(id, date);
  }


  @Delete(':id/:date')
  remove(@Param('id') id: string, @Param('date') date: Date) {
    return this.orsaveService.remove(id, date);
  }
}
