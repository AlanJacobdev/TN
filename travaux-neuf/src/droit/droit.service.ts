import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDroitDto } from './dto/create-droit.dto';
import { UpdateDroitDto } from './dto/update-droit.dto';
import { Droit } from './entities/droit.entity';

@Injectable()
export class DroitService {

  constructor(@InjectRepository(Droit) private DroitRepo : Repository<Droit>){}

  async create(createDroitDto: CreateDroitDto) {
    const droit = await this.findOne(createDroitDto.idDroit);
    if ( droit == undefined){
      createDroitDto.dateCreation = new Date();
      const newDroit = this.DroitRepo.create(createDroitDto);
      await this.DroitRepo.save(newDroit);
      return newDroit;
    } else {
      return {
        status : HttpStatus.CONFLICT,
        error :'Already exist',
      }
    }
  }

  findAll() {
    return this.DroitRepo.find();
  }

  async findOne(id: string) {
   return this.DroitRepo.findOne({
     where : {
       idDroit : id
     }
   })
  }

  async update(id: string, updateDroitDto: UpdateDroitDto) {
    const droit = await this.DroitRepo.findOne({
      where : {
        idDroit : id
      }
    })
    if (droit == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier not found'
      }
    }

    updateDroitDto.dateModification = new Date();
    await this.DroitRepo.update(id, updateDroitDto);
    return await this.DroitRepo.findOne(id);
  }

  async remove(id: string) {
    const Atelier = await this.DroitRepo.findOne({
      where : {
        idDroit : id
      }
    })

    if (Atelier == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
    try {
      await this.DroitRepo.delete(id);
    } catch (e : any) {
      return {
        status : HttpStatus.CONFLICT,
        error :'Impossible to delete',
      }
    }
    return {
      status : HttpStatus.OK,
      error :'Deleted',
    }
  }
}
