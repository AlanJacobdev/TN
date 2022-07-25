import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DocumentService } from './document.service';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('file-upload/:user')
@UseInterceptors(FilesInterceptor('document', 20, {
    storage: diskStorage({
      destination: './../document'
    })
  }))
  async createDocument(@UploadedFiles() file: Array<Express.Multer.File>, @Param('user') user :string) {
    console.log(file);
    
    return this.documentService.create(file, user)
  }
  

  @Get()
  findAll() {
    return this.documentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentService.remove(+id);
  }
}
