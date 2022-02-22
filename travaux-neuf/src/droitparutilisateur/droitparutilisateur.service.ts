import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DroitService } from 'src/droit/droit.service';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { Repository } from 'typeorm';
import { CreateDroitparutilisateurDto } from './dto/create-droitparutilisateur.dto';
import { UpdateDroitparutilisateurDto } from './dto/update-droitparutilisateur.dto';
import { Droitparutilisateur } from './entities/droitparutilisateur.entity';

@Injectable()
export class DroitparutilisateurService {

  constructor(@InjectRepository(Droitparutilisateur) private DpuRepo : Repository<Droitparutilisateur>, private droitservice : DroitService, private utiservice: UtilisateurService){}

  async create(createDroitparutilisateurDto: CreateDroitparutilisateurDto) {
    const droit = await this.droitservice.findOne(createDroitparutilisateurDto.idDroit);
    if (droit != undefined) {
      const service = await this.utiservice.findOne(createDroitparutilisateurDto.idUtilisateur);
      if(service != undefined){
        const droitParUtilisateur = await this.findOne(createDroitparutilisateurDto.idDroit,createDroitparutilisateurDto.idUtilisateur);
        if(droitParUtilisateur == undefined ){
          createDroitparutilisateurDto.dateCreation = new Date();
          const newDPU = this.DpuRepo.create(createDroitparutilisateurDto);
          await this.DpuRepo.save(newDPU);
          return newDPU;
        } else {
          return {
            status : HttpStatus.CONFLICT,
            error :'Already exist',
          }
        }
      } else {
        return {
          status : HttpStatus.NOT_FOUND,
          error :'Utilisateur doesn\'t exist',
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
    return this.DpuRepo.find();
  }

  async findOne(idDroit: string, idUtilisateur: number) {
    return this.DpuRepo.findOne({
      where :{
        idUtilisateur : idUtilisateur,
        idDroit : idDroit
      }
    })
  }

  async update(idDroit: string, idUtilisateur: number, updateDroitparutilisateurDto: UpdateDroitparutilisateurDto){
    const droitParService = await this.DpuRepo.findOne({
      where : {
        idDroit : idDroit,
        idUtilisateur : idUtilisateur
      }
    })
    if (droitParService == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier not found'
      }
    }
    updateDroitparutilisateurDto.dateModification = new Date();
    await this.DpuRepo.update({
      idDroit,
      idUtilisateur
    }, updateDroitparutilisateurDto);
    return await this.findOne(idDroit,idUtilisateur);
  }

  async remove(idDroit: string, idUtilisateur: number) {
      const droitParService = await this.DpuRepo.findOneOrFail({
        where : {
          idDroit : idDroit,
          idUtilisateur : idUtilisateur
        }
      })
   
  if (droitParService == undefined) {
    throw new HttpException({
      status : HttpStatus.NOT_FOUND,
      error : 'Not Found',
    }, HttpStatus.NOT_FOUND)
  } 
  try {
    await this.DpuRepo.delete({
      idDroit,
      idUtilisateur
    });
  } catch ( e :any) {
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
