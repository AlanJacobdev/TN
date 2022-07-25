import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentService } from 'src/document/document.service';
import { Repository } from 'typeorm';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { Information } from './entities/information.entity';

@Injectable()
export class InformationsService {

  constructor(@InjectRepository(Information) private informationServiceRepo : Repository<Information>, private documentService : DocumentService){}

  async create(createInformationDto: CreateInformationDto) {
        let tabDocument = [];
        if(createInformationDto.idDocument.length != 0 ) {
          for (const desc of createInformationDto.idDocument){
            let document = await this.documentService.findOne(desc);
            if (document != undefined){
              tabDocument.push(document)
            }  
          }
        }

        createInformationDto.dateCreation = new Date();
        createInformationDto.document = tabDocument;
        console.log(createInformationDto);
        
        const newInfo = this.informationServiceRepo.create(createInformationDto);
        await this.informationServiceRepo.save(newInfo);
        return newInfo;
      
    
  }

  findAll() {
    return `This action returns all informations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} information`;
  }

  update(id: number, updateInformationDto: UpdateInformationDto) {
    return `This action updates a #${id} information`;
  }

  remove(id: number) {
    return `This action removes a #${id} information`;
  }
}
