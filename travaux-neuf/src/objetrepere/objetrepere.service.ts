import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NumerouniqueService } from 'src/numerounique/numerounique.service';
import { TypeobjetrepereService } from 'src/typeobjetrepere/typeobjetrepere.service';
import { Repository } from 'typeorm';
import { CreateObjetrepereDto } from './dto/create-objetrepere.dto';
import { UpdateObjetrepereDto } from './dto/update-objetrepere.dto';
import { Objetrepere } from './entities/objetrepere.entity';

@Injectable()
export class ObjetrepereService {

  constructor(@InjectRepository(Objetrepere) private OrRepo : Repository<Objetrepere>, private nuservice : NumerouniqueService, private typeorservice : TypeobjetrepereService){}

  async create(createObjetrepereDto: CreateObjetrepereDto) {
    const typeor = this.typeorservice.findOne(+createObjetrepereDto.codeType); 
    if (typeor != undefined) {
      const nu = this.nuservice.findOne(+createObjetrepereDto.numeroUnique);
      if(nu != undefined) {
        const or = this.findOne(+createObjetrepereDto.idObjetRepere)
        if ( or == undefined){
          const newOr = this.OrRepo.create(createObjetrepereDto);
          await this.OrRepo.save(newOr);
          return newOr;
        } else {
          return  {
            status : HttpStatus.CONFLICT,
            error :'Already exist'
          }
        }
      } else {
        return  {
          status : HttpStatus.NOT_FOUND,
          error :'Numero Unique doesn\'t exist'
        }
      } 
    } else {
      return  {
        status : HttpStatus.NOT_FOUND,
        error :'Type doesn\'t exist'
      }
    }  
  }

  findAll() {
    return this.OrRepo.find();
  }

  findOne(id: number) {
    return this.OrRepo.findOne({ 
      where : {
          idObjetRepere : id
        }
      }
    )
  }

  async update(id: number, updateObjetrepereDto: UpdateObjetrepereDto) {
    try {
      const OR = this.OrRepo.findOneOrFail({
        where : {
          idObjetRepere : id
        }
      })


    } catch {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error :'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
    await this.OrRepo.update(id,updateObjetrepereDto);
    return this.OrRepo.findOne(id);
    
  }

  async remove(id: number) {
    try {
      const OR = this.OrRepo.findOneOrFail({
        where : {
          idObjetRepere : id
        }
      })
    } catch {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error :'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
    await this.OrRepo.delete(id)
    return this.OrRepo.findOne(id);
  }
}



