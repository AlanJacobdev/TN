import { Controller, Get, Post, Body, Response, Param, Delete, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { doc } from 'prettier';
import { exportGMAO } from './Interface';
import { ServiceExportationService } from './service-exportation.service';

@Controller('service-exportation')
export class ServiceExportationController {
  constructor(private readonly serviceExportationService: ServiceExportationService) {}



  @Get()
  findAll() {
    return this.serviceExportationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceExportationService.findOne(+id);
  }

  @Get('export/getAllExportItem')
  getAllExportItem(){
    return this.serviceExportationService.getAllExportItemForGMAO();
  }

  @Post('export/exportationData')
  async exportationData(@Response({ passthrough: true }) res, @Body() data: exportGMAO){

    let resFunc: any = await this.serviceExportationService.exportationData(data);
    if(!resFunc.hasOwnProperty('error')) {
      const fs = require('fs');
      if (fs.existsSync(resFunc)) {
        const file = createReadStream(join(process.cwd(), resFunc));
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="'+ data.nomDocument+'"',
        });
      return new StreamableFile(file);
      }
    } else {
      return resFunc;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceExportationService.remove(+id);
  }
}
