import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
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
        createObjetrepereDto.idObjetRepere = createObjetrepereDto.codeType + createObjetrepereDto.numeroUnique;
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
              error :'Numéro Unique déja utilisé',
            }, HttpStatus.CONFLICT)
          }
        } else {
          return  {
            status : HttpStatus.CONFLICT,
            error :'L\'objet repère déja existant'
          }
        }
      } else {
        return  {
          status : HttpStatus.NOT_FOUND,
          error :'Le numero unique n\'existe pas'
        }
      } 
    } else {
      return  {
        status : HttpStatus.NOT_FOUND,
        error :'Le type d\'objet n\'existe pas'
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

  findOneByNU(nu : string) {
    return this.OrRepo.findOne({
      select : ['libelleObjetRepere'],
      where : {
        numeroUnique : nu
      }
    })
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
        error :'Objet repère inconnu',
      }, HttpStatus.NOT_FOUND)
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

  async remove(id: string, user : string) {
    const OR = await this.OrRepo.findOne({
      where : {
        idObjetRepere : id
      }
    })
    if ( OR == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Identifiant d\'objet inconnu',
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
      profilModification : user,
      posteModification : ""    
    }
    
    await this.orsaveservice.create(orsaveDto);   

    try {
      await this.OrRepo.delete(id);
    } catch ( e : any) {
      await this.orsaveservice.remove(orsaveDto.idObjetRepere, orsaveDto.date);
      return {
        status : HttpStatus.CONFLICT,
        error :'Impossible de supprimer l\'objet (item lié)',
      }
    }
    
    return {
      status : HttpStatus.OK,
      message :'Objet repère supprimé',
    }
  }

  async getHistory(idItem : string) {
    return this.orsaveservice.findById(idItem);
  }


  async getAllNUAndORByAtelier(Atelier : string) {
    let res= []
    let allNU = await this.nuservice.findAllOnlyID(Atelier);
    let allORByAtelier = await this.getORByAtelier(Atelier);
    for (const nu of allNU) {
      res.push({
        "numeroUnique" : nu.idNumeroUnique,
        "libelleOR" : ""
      })
    }
    for (const or of allORByAtelier) {
      let index = res.findIndex((element) => element.numeroUnique === or.numeroUnique)
      res[index] = {
        "numeroUnique" : or.numeroUnique,
        "libelleOR" : or.libelleObjetRepere
      }
    }
    return res;
  }

}

