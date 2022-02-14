import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DroitService } from 'src/droit/droit.service';
import { Service } from 'src/service/entities/service.entity';
import { ServiceService } from 'src/service/service.service';
import { Repository } from 'typeorm';
import { CreateDroitparserviceDto } from './dto/create-droitparservice.dto';
import { UpdateDroitparserviceDto } from './dto/update-droitparservice.dto';
import { Droitparservice } from './entities/droitparservice.entity';

@Injectable()
export class DroitparserviceService {

  constructor(@InjectRepository(Droitparservice) private droitParServiceRepo : Repository<Droitparservice>, private droitservice : DroitService, private serviceService : ServiceService ){}

  async create(createDroitparserviceDto: CreateDroitparserviceDto) {
    const droit = await this.droitservice.findOne(createDroitparserviceDto.idDroit);
    if (droit != undefined) {
      const service = await this.serviceService.findOne(createDroitparserviceDto.idService);
      if(service != undefined){
        const droitParService = await this.findOne(createDroitparserviceDto.idDroit,createDroitparserviceDto.idService);
        if(droitParService == undefined){
          createDroitparserviceDto.dateCreation = new Date();
          const newDPS = this.droitParServiceRepo.create(createDroitparserviceDto);
          await this.droitParServiceRepo.save(newDPS);
          return newDPS;
        } else {
          return {
            status : HttpStatus.CONFLICT,
            error :'Already exist',
          }
        }
      } else {
        return {
          status : HttpStatus.NOT_FOUND,
          error :'Service doesn\'t exist',
        }
      }
    } else {
      return {
        status : HttpStatus.NOT_FOUND,
        error :'Droit doesn\'t exist',
      }
    }
  }

  findAll() {
    return this.droitParServiceRepo.find();
  }

  async findOne(idDroit: string, idService: string) {
    return this.droitParServiceRepo.findOne({
      where : {
        idDroit : idDroit,
        idService : idService
      }
    })
  }

  async update(idDroit: string, idService: string, updateDroitparserviceDto: UpdateDroitparserviceDto) {
    const droitParService = await this.droitParServiceRepo.findOne({
      where : {
        idDroit : idDroit,
        idService : idService
      }
    })

    if (droitParService == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier not found'
      }
    }
    if (updateDroitparserviceDto.idDroit != idDroit || updateDroitparserviceDto.idService != idService){
      return {
        status : HttpStatus.CONFLICT,
        error : 'Impossible to change ID'
      }
    }
    updateDroitparserviceDto.dateModification = new Date();
    await this.droitParServiceRepo.update({
      idDroit,
      idService
    }, updateDroitparserviceDto);
    return await this.findOne(idDroit,idService);

  }

  async remove(idDroit: string, idService: string) {
    const droitParService = await this.droitParServiceRepo.findOne({
      where : {
        idDroit : idDroit,
        idService : idService
      }
    })
    if(droitParService == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
    try {
      await this.droitParServiceRepo.delete({
        idDroit,
        idService
      });
    } catch ( e : any){
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
