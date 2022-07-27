import { Controller, Get, Post,Response, Param, Delete, UploadedFiles, UseInterceptors, StreamableFile, HttpStatus } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
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

  @Get('/readFile/:id')
  async getFile(@Response({ passthrough: true }) res, @Param('id') id: number): Promise<StreamableFile | { status: HttpStatus; error: string; }> {
    try{
      let doc = await this.documentService.findOne(id)
      const file = createReadStream(join(process.cwd(), doc.path));
      res.set({
        'Content-Type': doc.type,
        'Content-Disposition': 'attachment; filename="'+doc.nomDocument+'"',
      });
      return new StreamableFile(file);
    } catch (e :any) {
      return {
        status : HttpStatus.CONFLICT,
        error :'Document inconnu',
      }
    }
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentService.remove(+id);
  }
}
