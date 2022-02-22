import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type } from 'os';
import { Repository } from 'typeorm';
import { CreateTypeobjetDto } from './dto/create-typeobjet.dto';
import { UpdateTypeobjetDto } from './dto/update-typeobjet.dto';
import { Typeobjet } from './entities/typeobjet.entity';

@Injectable()
export class TypeobjetService {

  constructor(@InjectRepository(Typeobjet) private typeObjetRepo : Repository<Typeobjet> ){}

  async create(createTypeobjetDto: CreateTypeobjetDto) {
    const typeobjet= await this.findOne(createTypeobjetDto.idType)
    if ( typeobjet == undefined){
      createTypeobjetDto.dateCreation = new Date();
      const newTO = this.typeObjetRepo.create(createTypeobjetDto);
      await this.typeObjetRepo.save(newTO);
      return newTO;
    } else {
      return {
        status : HttpStatus.CONFLICT,
        error :'Already exist',
      }
    }
  }

  findAll() {
    return this.typeObjetRepo.find();
  }

  findOne(id: string) {
    return this.typeObjetRepo.findOne({
      where : {
        idType : id
      }
    })
  }

  async update(id: string, updateTypeobjetDto: UpdateTypeobjetDto) {
    const typeObjet = await this.typeObjetRepo.findOne({
      where : {
        idType : id
      }
    })
    if (typeObjet == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier not found'
      }
    }
    
    updateTypeobjetDto.dateModification = new Date();
    await this.typeObjetRepo.update(id, updateTypeobjetDto);
    return await this.typeObjetRepo.findOne(id);

  }

  async remove(id: string) {
    const TypeObjet = await this.typeObjetRepo.findOne({
      where : {
        idType : id
      }
    })
    if (TypeObjet == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND);
    }
    try { 
      await this.typeObjetRepo.delete(id);
    } catch ( e: any ) {
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
