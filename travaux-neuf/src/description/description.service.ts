import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDescriptionDto } from './dto/create-description.dto';
import { UpdateDescriptionDto } from './dto/update-description.dto';
import { Description } from './entities/description.entity';

@Injectable()
export class DescriptionService {
  
  constructor(@InjectRepository(Description) private descriptionRepo : Repository<Description> ){
  }

  async create(createDescriptionDto: CreateDescriptionDto) {
    const descriptionExist = await this.descriptionRepo.findOne({
      where : {
        lien : createDescriptionDto.lien
      }
    })
    if (descriptionExist == undefined) {
      const newDescription = this.descriptionRepo.create(createDescriptionDto);
      const saveDescription = this.descriptionRepo.save(newDescription);
      return saveDescription;
    } else {
      return descriptionExist
    }

  }


  findOneByLien(lien: string) {
    return this.descriptionRepo.findOne({
      where : {
        lien : lien
      }
    })
  }
  
  findOneByID(id: number) {
    return this.descriptionRepo.findOne({
      where : {
        idDescription : id
      }
    })
  }


  async update(id: number, updateDescriptionDto: UpdateDescriptionDto) {
    const description = await this.descriptionRepo.findOne({
      where : {
        idDescription : id
      }
    })
    if (description == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Lien introuvable'
      }
    }
    await this.descriptionRepo.update(id, updateDescriptionDto);
    return await this.descriptionRepo.findOne(id);
    
  }


  async remove(id: number) {
    const item = await this.descriptionRepo.findOne({
      where : {
        idDescription : id
      }
    })
    if(item == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Lien non trouvé',
      }, HttpStatus.NOT_FOUND);
    }

    try {
      await this.descriptionRepo.delete(id)
    } catch ( e : any) {
      return {
        status : HttpStatus.CONFLICT,
        error :'Impossible de supprimer la description (liée à d\'autre objets)',
      }
    }

    return {
      status : HttpStatus.OK,
      message :'Description supprimée',
    }

  }
}
