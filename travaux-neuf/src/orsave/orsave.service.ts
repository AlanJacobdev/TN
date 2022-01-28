import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LargeNumberLike } from 'crypto';
import moment from 'moment';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { Repository } from 'typeorm';
import { CreateOrsaveDto } from './dto/create-orsave.dto';
import { UpdateOrsaveDto } from './dto/update-orsave.dto';
import { Orsave } from './entities/orsave.entity';

@Injectable()
export class OrsaveService {


  constructor(@InjectRepository(Orsave) private orsaveRepo : Repository<Orsave>,  @Inject(forwardRef(() => ObjetrepereService)) private orservice : ObjetrepereService){}

  async create(createOrsaveDto: CreateOrsaveDto) {
    const orExist = await this.orservice.findOne(createOrsaveDto.idObjetRepere);
    if ( orExist != undefined) {
      const orSave = await this.findOne(createOrsaveDto.idObjetRepere, createOrsaveDto.date, createOrsaveDto.heure);
      if ( orSave == undefined){
        const newOrSave = this.orsaveRepo.create(createOrsaveDto);
        await this.orsaveRepo.save(newOrSave);
        return newOrSave;
      } else {
        return  {
          status : HttpStatus.NOT_FOUND,
          error :'Already exist'
        }
      }
    } else {
      return  {
        status : HttpStatus.NOT_FOUND,
        error :'Objet Repère doesn\'t exist'
      }
    }
  }

  findAll() {
    return this.orsaveRepo.find()
  }

  findById(id: string) {
    return this.orsaveRepo.find({
      where : {
        idObjetRepere : id
      }
    })
  }

  findOne(id: string, date: Date, heure:Date ){
    return this.orsaveRepo.findOne({
      where : {
        idObjetRepere : id,
        date : date,
        heure : heure
      }
    })
  }

 
  async remove(idObjetRepere: string, date: Date, heure: Date) {
    

    const OR = await this.orsaveRepo.findOne({
      where : {
        idObjetRepere : idObjetRepere,
        date : date.toISOString().slice(0,10),
        heure : heure.toLocaleTimeString()
      }
    })
    
    if (OR == undefined ) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error :'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
    await this.orsaveRepo.delete({
      idObjetRepere ,
      date : date.toISOString().slice(0,10),
      heure: heure.toLocaleTimeString()
    })
    return {
      status : HttpStatus.OK,
      error :'Deleted',
    }
  }
}
