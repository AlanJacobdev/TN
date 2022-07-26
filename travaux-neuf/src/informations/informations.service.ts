import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    
    return this.informationServiceRepo.find({
      order:{
        dateCreation : "DESC"
      },
      relations : ["document"]
    });
  }

  findOne(id: number) {
    return this.informationServiceRepo.findOne({
      where : {
        idInfo : id
      },
      relations : ["document"]
    })
  }

  async update(id: number, updateInformationDto: UpdateInformationDto) {
    const info = await this.informationServiceRepo.findOne({
      where : {
        idInfo : id
      },
      relations : ["document"]
    })

    if ( info == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifiant non trouvé'
      }
    }

    if(info.text === updateInformationDto.text 
      && JSON.stringify(info.document) === JSON.stringify(updateInformationDto.document)){
        throw new HttpException({
          status : HttpStatus.NOT_MODIFIED,
          error :'Aucune modification effectuée',
        }, HttpStatus.NOT_FOUND)
    }

    let tabDocumentAfter = [];

    if( updateInformationDto.idDocument.length != 0 ) {
      for (const desc of updateInformationDto.idDocument){
        const doc = await this.documentService.findOne(desc);
        tabDocumentAfter.push(doc);
      }
    }

    
    info.dateModification = new Date();
    info.text = updateInformationDto.text;
    info.profilModification = updateInformationDto.profilModification;
    info.document = tabDocumentAfter;
    await this.informationServiceRepo.save(info);
    
    return await this.informationServiceRepo.findOne({
      where : {
        idInfo : id
      },
      relations : ["document"]
    });


  }

  async remove(id: number) {
    
    const info = await this.informationServiceRepo.findOne({
      where : {
        idInfo : id
      },
      relations : ["document"]
    })

    if ( info == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Item non trouvé',
      }, HttpStatus.NOT_FOUND);
    }

    try{
      for (const doc of info.document) {
        await this.documentService.remove(doc.idDoc);
      }
      
    } catch ( e :any){
      return {
        status : HttpStatus.CONFLICT,
        error : 'Problème de suppression de documents'
      }
    }
    try {
      await this.informationServiceRepo.remove(info);
    } catch ( e : any) {
      return {
        status : HttpStatus.CONFLICT,
        error :'Impossible de supprimer l\'information',
      }
    }
    
    return {
      status : HttpStatus.OK,
      message :'Information supprimée',
    }

  }
}
