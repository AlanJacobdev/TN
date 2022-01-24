import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { report } from 'process';
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
    await this.DroitRepo.update(id, updateDroitDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    try {
      const Atelier = this.DroitRepo.findOneOrFail({
        where : {
          idDroit : id
        }
      })
    } catch {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
    await this.DroitRepo.delete(id)
    return {
      status : HttpStatus.OK,
      error :'Deleted',
    }
  }
}
