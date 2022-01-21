import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { Repository } from 'typeorm';
import { CreateOrsaveDto } from './dto/create-orsave.dto';
import { UpdateOrsaveDto } from './dto/update-orsave.dto';
import { Orsave } from './entities/orsave.entity';

@Injectable()
export class OrsaveService {

  constructor(@InjectRepository(Orsave) private orsaveRepo : Repository<Orsave>, private orservice : ObjetrepereService){}

  async create(createOrsaveDto: CreateOrsaveDto) {
    const orExist = this.orservice.findOne(+createOrsaveDto.idObjetRepere);
    if ( orExist != undefined) {
      const newOrSave = this.orsaveRepo.create(createOrsaveDto);
      await this.orsaveRepo.save(newOrSave);
      return newOrSave;
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

  findOne(id: number) {
    return this.orsaveRepo.findOne({
      where : {
        idObjetRepere : id
      }
    })
  }

  async update(id: number, updateOrsaveDto: UpdateOrsaveDto) {
    const typeor = await this.orsaveRepo.findOne({
      where : {
        idObjetRepere : id
      }
    })
    if (typeor == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier not found'
      }
    }
    await this.orsaveRepo.update(id, updateOrsaveDto);
    return this.orsaveRepo.findOne(id);
  }

  async remove(id: number) {
    try {
      const OR = this.orsaveRepo.findOneOrFail({
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
    await this.orsaveRepo.delete(id)
    return this.orsaveRepo.findOne(id);
  }
}
