import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AtelierService } from 'src/atelier/atelier.service';
import { Repository } from 'typeorm';
import { CreateNumerouniqueDto } from './dto/create-numerounique.dto';
import { UpdateNumerouniqueDto } from './dto/update-numerounique.dto';
import { Numerounique } from './entities/numerounique.entity';

@Injectable()
export class NumerouniqueService {
  
  constructor(@InjectRepository(Numerounique) private NuRepo : Repository<Numerounique>, private atelierService: AtelierService){}

  async create(createNumerouniqueDto: CreateNumerouniqueDto) {
    const AtelierExist = await this.atelierService.findOne(createNumerouniqueDto.idAtelier.idAtelier);
    if(AtelierExist == undefined){
      const numeroExist = await this.findOne(createNumerouniqueDto.idNumeroUnique);
      if(numeroExist == undefined) {
        createNumerouniqueDto.dateCreation = new Date();
        const NU = this.NuRepo.create(createNumerouniqueDto);
        await this.NuRepo.save(NU);
        return NU;
      } else {
        return {
          status : HttpStatus.CONFLICT,
          error : "Already Exist"
        }
      }
    } else {
      return {
        status : HttpStatus.NOT_FOUND,
        error : "Atelier Not found"
      }
    }
  }

  findAll() {
    return this.NuRepo.find();
  }

  findOne(id: string) {
    return this.NuRepo.findOne({
      where : {
        idNumeroUnique : id
      }
    })
  }

  async update(id: string, updateNumerouniqueDto: UpdateNumerouniqueDto) {
    
    const Nu = await this.NuRepo.findOne(id)
    if( Nu == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier Not Found'
      }
    }
    updateNumerouniqueDto.dateModification = new Date();
    await this.NuRepo.update(id, updateNumerouniqueDto);
    return await this.NuRepo.findOne(id);
}

  async remove(id: string) {
    const Nu = await this.NuRepo.findOne({
      where : {
        idNumeroUnique : id
      }
    })
    
    if(Nu == undefined){
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
   
    await this.NuRepo.delete(id)
    return {
      status : HttpStatus.OK,
      error :'Deleted',
    }
    
  }
}
