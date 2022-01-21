import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAtelierDto } from './dto/create-atelier.dto';
import { UpdateAtelierDto } from './dto/update-atelier.dto';
import { Atelier } from './entities/atelier.entity';

@Injectable()
export class AtelierService {
  
  constructor(@InjectRepository(Atelier) private AtelierRepo : Repository<Atelier> ){}

  async create(createAtelierDto: CreateAtelierDto) {
    const atelier = this.findOne(+createAtelierDto.idAtelier)
    if ( atelier == undefined){
      const newAtelier = this.AtelierRepo.create(createAtelierDto);
      await this.AtelierRepo.save(newAtelier);
      return newAtelier;
    } else {
      return {
        status : HttpStatus.CONFLICT,
        error :'Already exist',
      }
    }
  }

  findAll() {
    return this.AtelierRepo.find();
  }

  findOne(id: number) {
    return this.AtelierRepo.findOne({
      where : {
        idAtelier : id
      }
    })
  }

  async update(id: number, updateAtelierDto: UpdateAtelierDto) {
    const atelier = await this.AtelierRepo.findOne({
      where : {
        idAtelier : id
      }
    })
    if (atelier == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier not found'
    }
  }
    await this.AtelierRepo.update(id, updateAtelierDto);
    return this.AtelierRepo.findOne(id);

  }

  async remove(id: number) {
    try {
      const Atelier = this.AtelierRepo.findOneOrFail({
        where : {
          idAtelier : id
        }
      })
    } catch {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error :-'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
    await this.AtelierRepo.delete(id)
    return this.AtelierRepo.findOne(id);
  }
}
