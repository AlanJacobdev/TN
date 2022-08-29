import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { TypeobjetService } from './typeobjet.service';
import { CreateTypeobjetDto } from './dto/create-typeobjet.dto';
import { UpdateTypeobjetDto } from './dto/update-typeobjet.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

@Controller('typeobjet')
export class TypeobjetController {
  constructor(private readonly typeobjetService: TypeobjetService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTypeobjetDto: CreateTypeobjetDto) {
    return this.typeobjetService.create(createTypeobjetDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.typeobjetService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll/isActif')
  findAllTypeOActif(){
    return this.typeobjetService.findAllTypeOActif();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeobjetService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTypeobjetDto: UpdateTypeobjetDto) {
    return this.typeobjetService.update(id, updateTypeobjetDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeobjetService.remove(id);
  }
}
