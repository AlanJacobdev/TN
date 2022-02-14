import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { Repository } from 'typeorm';
import { CreateOrsaveDto } from './dto/create-orsave.dto';
import { Orsave } from './entities/orsave.entity';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class OrsaveService {


  constructor(@InjectRepository(Orsave) private orsaveRepo : Repository<Orsave>,  @Inject(forwardRef(() => ObjetrepereService)) private orservice : ObjetrepereService, private configservice : ConfigService){}

  async create(createOrsaveDto: CreateOrsaveDto) {
    const orExist = await this.orservice.findOne(createOrsaveDto.idObjetRepere);
    if ( orExist != undefined) {
      const orSave = await this.findOne(createOrsaveDto.idObjetRepere, createOrsaveDto.date, createOrsaveDto.heure);
      if ( orSave == undefined){
        try{
        const newOrSave = this.orsaveRepo.create(createOrsaveDto);
        await this.orsaveRepo.save(newOrSave);
        if(createOrsaveDto.etat === 'M') {
          await this.deleteSaveOlderThan(createOrsaveDto.idObjetRepere);
        }
        return newOrSave;
        } catch (e : any){
          return {
            status : HttpStatus.CONFLICT,
            error : "Two insertions at same time",
          }
        }
      } else {
        return  {
          status : HttpStatus.NOT_FOUND,
          error :'Already exist'
        }
      }
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

  findById(id: string) {
    return this.orsaveRepo.find({
      where : {
        idObjetRepere : id
      }
    })
  }

  findOne(id: string, date: Date, heure:Date ){
    return this.orsaveRepo.findOne({
      where : {
        idObjetRepere : id,
        date : date,
        heure : heure
      }
    })
  }

 
  async remove(idObjetRepere: string, date: Date, heure: Date) {
    date = new Date(date);
    let newHeure = new Date();
    const heureSplit = heure.toString().split(':');
    newHeure.setHours(parseInt(heureSplit[0]), parseInt(heureSplit[1]),parseInt(heureSplit[2]));

    const OR = await this.orsaveRepo.findOne({
      where : {
        idObjetRepere : idObjetRepere,
        date : date.toISOString().slice(0,10),
        heure : newHeure.toLocaleTimeString()
      }
    })
    
    if (OR == undefined ) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error :'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
    await this.orsaveRepo.delete({
      idObjetRepere ,
      date : date.toISOString().slice(0,10),
      heure: newHeure.toLocaleTimeString()
    })
    return {
      status : HttpStatus.OK,
      error :'Deleted',
    }
  }

  async deleteSaveOlderThan (id : string){
    const existingBackUp = await this.orsaveRepo.find({
      where : {
        idObjetRepere : id
      },
      order : {
        date : "ASC",
        heure : "ASC"
      }
    })

    if ( existingBackUp.length > this.configservice.get('maxSave') ){
      const DeletedBackUp = await this.orsaveRepo.find({
        where : {
          idObjetRepere : id
        },
        order : {
          date : "ASC",
          heure : "ASC"
        },
        take: 1,
      })
      this.remove(DeletedBackUp[0].idObjetRepere, DeletedBackUp[0].date ,DeletedBackUp[0].heure);
    }

  }

}
