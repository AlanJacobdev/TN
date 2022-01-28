import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceService {
  
  constructor(@InjectRepository(Service) private serviceRepo : Repository<Service>){}


  async create(createServiceDto: CreateServiceDto) {
    const service = await this.findOne(createServiceDto.idService);
    if ( service == undefined){
      const newService = this.serviceRepo.create(createServiceDto);
      await this.serviceRepo.save(newService);
      return newService;
    } else {
      return {
        status : HttpStatus.CONFLICT,
        error :'Already exist',
      }
    }
  }

  findAll() {
    return this.serviceRepo.find();
  }

  findOne(id: string) {
    return this.serviceRepo.findOne({
      where :{
        idService : id
      }
    })
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.serviceRepo.findOne({
      where : {
        idService : id
      }
    })
    if (service == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier not found'
    }
  }
    await this.serviceRepo.update(id, updateServiceDto);
    return await this.serviceRepo.findOne(id);
  }

  async remove(id: string) {
    
      const Service = await this.serviceRepo.findOne({
        where : {
          idService : id
        }
      })
    if (Service == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
    try {
      await this.serviceRepo.delete(id);
    } catch ( e : any) {
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
