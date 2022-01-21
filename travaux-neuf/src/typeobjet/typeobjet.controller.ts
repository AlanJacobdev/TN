import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypeobjetService } from './typeobjet.service';
import { CreateTypeobjetDto } from './dto/create-typeobjet.dto';
import { UpdateTypeobjetDto } from './dto/update-typeobjet.dto';

@Controller('typeobjet')
export class TypeobjetController {
  constructor(private readonly typeobjetService: TypeobjetService) {}

  @Post()
  create(@Body() createTypeobjetDto: CreateTypeobjetDto) {
    return this.typeobjetService.create(createTypeobjetDto);
  }

  @Get()
  findAll() {
    return this.typeobjetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeobjetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeobjetDto: UpdateTypeobjetDto) {
    return this.typeobjetService.update(+id, updateTypeobjetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeobjetService.remove(+id);
  }
}
