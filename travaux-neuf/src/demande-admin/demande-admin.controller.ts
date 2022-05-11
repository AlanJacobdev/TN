import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DemandeAdminService } from './demande-admin.service';
import { CreateDemandeAdminDto } from './dto/create-demande-admin.dto';
import { UpdateDemandeAdminDto } from './dto/update-demande-admin.dto';

@Controller('demande-admin')
export class DemandeAdminController {
  constructor(private readonly demandeAdminService: DemandeAdminService) {}

  @Post()
  create(@Body() createDemandeAdminDto: CreateDemandeAdminDto) {
    return this.demandeAdminService.create(createDemandeAdminDto);
  }

  @Get()
  findAll() {
    return this.demandeAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.demandeAdminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDemandeAdminDto: UpdateDemandeAdminDto) {
    return this.demandeAdminService.update(+id, updateDemandeAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.demandeAdminService.remove(+id);
  }
}
