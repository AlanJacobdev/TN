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
      const orSave = await this.findOne(createOrsaveDto.idObjetRepere, createOrsaveDto.date);
      if ( orSave == undefined){
        try{
        const newOrSave = this.orsaveRepo.create(createOrsaveDto);
        const save = await this.orsaveRepo.save(newOrSave);
        // if(createOrsaveDto.status === 'M') {
        //   await this.deleteSaveOlderThan(createOrsaveDto.idObjetRepere);
        // }
        return save;
        } catch (e : any){
          
          throw new HttpException ({
            status : HttpStatus.CONFLICT,
            error : "Two insertions at same time",
          },HttpStatus.CONFLICT)
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
      },
      order : {
        date : 'DESC'
      },
      relations: ["description"]
    })
  }


  findOnebyIDDesc(id: string) {
    return this.orsaveRepo.findOne({
      where : {
        idObjetRepere : id
      },
      order : {
        date : 'DESC'
      },
      relations: ["description"]
    })
  }

  async findHistoryById(id: string) {
    let finalHistory = [];
    const history = await this.orsaveRepo.find({
      where : {
        idObjetRepere : id
      },
      order : {
        date : 'DESC'
      },
      take : 5,
      relations: ["description"]
    })


    const verifyIfDeleted = history.findIndex((element) => element.status == 'D')

    if ( verifyIfDeleted != -1 ){
      for (const or of history){
        if (or.status == 'D'){
          return finalHistory
        } else {
          finalHistory.push(or)
        }
      }
    } else {
      return history
    }

  }

  findOne(id: string, date: Date){
    
    return this.orsaveRepo.findOne({
      where : {
        idObjetRepere : id,
        date : date
      },
      relations: ["description"]
    })
  }

 
  async remove(idObjetRepere: string, date: Date) {
    date = new Date(date);
    

    const OR = await this.orsaveRepo.findOne({
      where : {
        idObjetRepere : idObjetRepere,
        date : date
      }
    })
    
    if (OR == undefined ) {
      return ({
        status : HttpStatus.NOT_FOUND,
        error :'Not Found',
      })
    }
    await this.orsaveRepo.delete({
      idObjetRepere ,
      date : date
    })
    return {
      status : HttpStatus.OK,
      error :'Deleted',
    }
  }

  // async deleteSaveOlderThan (id : string){
  //   const existingBackUp = await this.orsaveRepo.find({
  //     where : {
  //       idObjetRepere : id
  //     },
  //     order : {
  //       date : "ASC"
  //     }
  //   })

  //   if ( existingBackUp.length > this.configservice.get('maxSave') ){
  //     const DeletedBackUp = await this.orsaveRepo.find({
  //       where : {
  //         idObjetRepere : id
  //       },
  //       order : {
  //         date : "ASC"
  //       },
  //       take: existingBackUp.length - this.configservice.get('maxSave'),
  //     })
  //     for (const or of DeletedBackUp){
  //       this.remove(or.idObjetRepere, or.date );
  //     }
  //   }
   
  // }

}
