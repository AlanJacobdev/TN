import { HttpStatus, Injectable } from '@nestjs/common';
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
    const typeobjet= this.findOne(+createTypeobjetDto.idType)
    if ( typeobjet == undefined){
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

  findOne(id: number) {
    return this.typeObjetRepo.findOne({
      where : {
        idType : id
      }
    })
  }

  async update(id: number, updateTypeobjetDto: UpdateTypeobjetDto) {
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
    await this.typeObjetRepo.update(id, updateTypeobjetDto);
    return this.typeObjetRepo.findOne(id);

  }

  remove(id: number) {
    return `This action removes a #${id} typeobjet`;
  }
}
