import { Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import { InformationsService } from './informations.service';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';

@Controller('informations')
export class InformationsController {
  constructor(private readonly informationsService: InformationsService) {}

  @Post()
  create(@Body() createInformationDto: CreateInformationDto) {
    return this.informationsService.create(createInformationDto);
  }

  @Get()
  findAll() {
    return this.informationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.informationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInformationDto: UpdateInformationDto) {
    return this.informationsService.update(+id, updateInformationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.informationsService.remove(+id);
  }
}


