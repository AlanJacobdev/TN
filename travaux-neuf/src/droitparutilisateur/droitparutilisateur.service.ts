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
        if(droitParUtilisateur == undefined){
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
    return this.DpuRepo.find();
  }

  async findOne(idDroit: string, idUtilisateur: number) {
    return this.DpuRepo.find({
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
    await this.DpuRepo.update(droitParService, updateDroitparutilisateurDto);
    return await this.findOne(idDroit,idUtilisateur);
  }

  async remove(idDroit: string, idUtilisateur: number) {
    try {
      const droitParService = await this.DpuRepo.findOneOrFail({
        where : {
          idDroit : idDroit,
          idUtilisateur : idUtilisateur
        }
      })
    await this.DpuRepo.delete(droitParService);
  } catch {
    throw new HttpException({
      status : HttpStatus.NOT_FOUND,
      error : 'Not Found',
    }, HttpStatus.NOT_FOUND)
  }
    return {
      status : HttpStatus.OK,
      error :'Deleted',
    }
  }
}
