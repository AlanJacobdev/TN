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
    const atelier = await this.findOne(createAtelierDto.idAtelier);
    if ( atelier == undefined){
      createAtelierDto.dateCreation = new Date();
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

  findOne(id: string) {
    return this.AtelierRepo.findOne({
      where : {
        idAtelier : id
      }
    })
  }

  async update(id: string, updateAtelierDto: UpdateAtelierDto) {
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
    updateAtelierDto.dateModification = new Date();
    await this.AtelierRepo.update(id, updateAtelierDto);
    return await this.AtelierRepo.findOne(id);
  }

  async remove(id: string) {
    const Atelier = await this.AtelierRepo.findOne({
      where : {
        idAtelier : id
      }
    })
    if(Atelier == undefined){
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND);
    }
    await this.AtelierRepo.delete(id);
    return {
      status : HttpStatus.OK,
      error :'Deleted',
    }
  }
}
