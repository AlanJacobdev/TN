import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NumerouniqueService } from 'src/numerounique/numerounique.service';
import { CreateOrsaveDto } from 'src/orsave/dto/create-orsave.dto';
import { Orsave } from 'src/orsave/entities/orsave.entity';
import { OrsaveService } from 'src/orsave/orsave.service';
import { TypeobjetrepereService } from 'src/typeobjetrepere/typeobjetrepere.service';
import { ILike, Repository } from 'typeorm';
import { CreateObjetrepereDto } from './dto/create-objetrepere.dto';
import { UpdateObjetrepereDto } from './dto/update-objetrepere.dto';
import { Objetrepere } from './entities/objetrepere.entity';

@Injectable()
export class ObjetrepereService {
  

  constructor(@InjectRepository(Objetrepere) private OrRepo : Repository<Objetrepere>, private nuservice : NumerouniqueService, private typeorservice : TypeobjetrepereService,  private orsaveservice : OrsaveService){}

  async create(createObjetrepereDto: CreateObjetrepereDto) {
    const typeor = await this.typeorservice.findOne(createObjetrepereDto.codeType); 
    if (typeor != undefined) {
      const nu = await this.nuservice.findOne(createObjetrepereDto.numeroUnique);
      if(nu != undefined) {
        const or = await this.findOne(createObjetrepereDto.idObjetRepere)
        if ( or == undefined){
          try {
          createObjetrepereDto.dateCreation = new Date();
          const newOr = this.OrRepo.create(createObjetrepereDto);
          await this.OrRepo.save(newOr);
          return newOr;
          } catch (e:any){
            throw new HttpException({
              status : HttpStatus.CONFLICT,
              error :'Numéro Unique already use',
            }, HttpStatus.CONFLICT)
          }
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

  findOne(id: string) {
    return this.OrRepo.findOne({ 
      where : {
          idObjetRepere : id
        }
      }
    )
  }

  getORByAtelier(id: string) {
    return this.OrRepo.find({
      where : {
        numeroUnique : ILike(id+"%")
      }
    })
  }

  async update(id: string, updateObjetrepereDto: UpdateObjetrepereDto) {
    const OR = await this.OrRepo.findOne({
      where : {
        idObjetRepere : id
      }
    })
    if (OR == undefined){
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error :'Not Found',
      }, HttpStatus.NOT_FOUND)
    }

    if (updateObjetrepereDto.codeType != OR.codeType) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Impossible to change Code Type'
      }
    }

    if (updateObjetrepereDto.numeroUnique != OR.numeroUnique) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Impossible to change Numero Unique'
      }
    }
 
    let orsaveDto = new CreateOrsaveDto;
    orsaveDto = {
      idObjetRepere : OR.idObjetRepere,
      libelleObjetRepere : OR.libelleObjetRepere,
      codeType : OR.codeType,
      numeroUnique : OR.numeroUnique,
      valide : OR.valide,
      description : OR.description,
      date : new Date(),
      etat : "M",
      profilModification : updateObjetrepereDto.profilModification,
      posteModification : updateObjetrepereDto.posteModification    
    }

    await this.orsaveservice.create(orsaveDto);   
    updateObjetrepereDto.dateModification = new Date();
    await this.OrRepo.update(id,updateObjetrepereDto);
    return await this.OrRepo.findOne(id);
  }

  async remove(id: string) {
    const OR = await this.OrRepo.findOne({
      where : {
        idObjetRepere : id
      }
    })
    if ( OR == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND);
    }


    let orsaveDto = new CreateOrsaveDto;
    orsaveDto = {
      idObjetRepere : OR.idObjetRepere,
      libelleObjetRepere : OR.libelleObjetRepere,
      codeType : OR.codeType,
      numeroUnique : OR.numeroUnique,
      valide : OR.valide,
      description : OR.description,
      date : new Date(),
      etat : "D",
      profilModification : "",
      posteModification : ""    
    }
    
    await this.orsaveservice.create(orsaveDto);   

    try {
      await this.OrRepo.delete(id);
    } catch ( e : any) {
      await this.orsaveservice.remove(orsaveDto.idObjetRepere, orsaveDto.date);
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

  async getHistory(idItem : string) {
    return this.orsaveservice.findById(idItem);
  }


}



