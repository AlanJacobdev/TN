import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypeobjetrepereService } from './typeobjetrepere.service';
import { CreateTypeobjetrepereDto } from './dto/create-typeobjetrepere.dto';
import { UpdateTypeobjetrepereDto } from './dto/update-typeobjetrepere.dto';

@Controller('typeobjetrepere')
export class TypeobjetrepereController {
  constructor(private readonly typeobjetrepereService: TypeobjetrepereService) {}

  @Post()
  create(@Body() createTypeobjetrepereDto: CreateTypeobjetrepereDto) {
    return this.typeobjetrepereService.create(createTypeobjetrepereDto);
  }

  @Get()
  findAll() {
    return this.typeobjetrepereService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeobjetrepereService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeobjetrepereDto: UpdateTypeobjetrepereDto) {
    return this.typeobjetrepereService.update(+id, updateTypeobjetrepereDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeobjetrepereService.remove(+id);
  }
}
