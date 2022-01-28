import { HttpException, HttpStatus, Injectable, Type } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type } from 'os';
import { config } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateTypeobjetrepereDto } from './dto/create-typeobjetrepere.dto';
import { UpdateTypeobjetrepereDto } from './dto/update-typeobjetrepere.dto';
import { Typeobjetrepere } from './entities/typeobjetrepere.entity';

@Injectable()
export class TypeobjetrepereService {
  constructor(@InjectRepository(Typeobjetrepere) private TypeOrRepo : Repository<Typeobjetrepere> ){}

  async create(createTypeobjetrepereDto: CreateTypeobjetrepereDto) {
    const typeor = await this.findOne(createTypeobjetrepereDto.idTypeOR)
    if ( typeor == undefined){
      createTypeobjetrepereDto.dateCreation = new Date();
      const newOr = this.TypeOrRepo.create(createTypeobjetrepereDto);
      await this.TypeOrRepo.save(newOr);
      return newOr;
    } else {
      return {
        status : HttpStatus.CONFLICT,
        error :'Already exist',
      }
    }
  }

  findAll() {
    return this.TypeOrRepo.find();
  }

  findOne(id: string) {
    return this.TypeOrRepo.findOne({
      where :{
        idTypeOR : id
      }
    })
  }

  async  update(id: string, updateTypeobjetrepereDto: UpdateTypeobjetrepereDto) {
    const typeor = await this.TypeOrRepo.findOne({
      where : {
        idTypeOR : id
      }
    })
    if (typeor == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier not found'
    }
  }
    updateTypeobjetrepereDto.dateModification = new Date();
    await this.TypeOrRepo.update(id, updateTypeobjetrepereDto);
    return await this.TypeOrRepo.findOne(id);


  }

  async remove(id: string) {
    const typeOr = await this.TypeOrRepo.findOne({
      where : {
        idTypeOR : id
      }
    })
    
    if( typeOr == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
    try {  
      await this.TypeOrRepo.delete(id)
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
