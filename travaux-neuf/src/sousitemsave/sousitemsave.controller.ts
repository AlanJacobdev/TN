import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SousitemsaveService } from './sousitemsave.service';
import { CreateSousitemsaveDto } from './dto/create-sousitemsave.dto';
import { UpdateSousitemsaveDto } from './dto/update-sousitemsave.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

@Controller('sousitemsave')
export class SousitemsaveController {
  constructor(private readonly sousitemsaveService: SousitemsaveService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSousitemsaveDto: CreateSousitemsaveDto) {
    return this.sousitemsaveService.create(createSousitemsaveDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.sousitemsaveService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/:date')
  findOne(@Param('id') id: string, @Param('date') date: Date) {
    return this.sousitemsaveService.findOne(id, date);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.sousitemsaveService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/:date')
  remove(@Param('id') id: string, @Param('date') date: Date) {
    return this.sousitemsaveService.remove(id, date);
  }
}
