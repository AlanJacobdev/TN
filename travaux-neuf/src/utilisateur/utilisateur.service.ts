import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceService } from 'src/service/service.service';
import { Repository } from 'typeorm';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { Utilisateur } from './entities/utilisateur.entity';

@Injectable()
export class UtilisateurService {

  constructor(@InjectRepository(Utilisateur) private utiRepo: Repository<Utilisateur>, private serviceService: ServiceService){}
  
  async create(createUtilisateurDto: CreateUtilisateurDto) {
    const service = await this.serviceService.findOne(createUtilisateurDto.idService);
    if (service != undefined) {
      const uti = await this.findOne(createUtilisateurDto.idUtilisateur);
      if (uti == undefined){
        createUtilisateurDto.dateCreation = new Date();
        const newUti = this.utiRepo.create(createUtilisateurDto);
        const u = await this.utiRepo.save(newUti);
        return u;
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
  }

  findAll() {
    return this.utiRepo.find();
  }

  async findOne(id: number) {
    return this.utiRepo.findOne({
      where : {
        idUtilisateur : id
      }
    })
  }

  async update(id: number, updateUtilisateurDto: UpdateUtilisateurDto) {
    const uti = await this.utiRepo.findOne({
      where : {
        idUtilisateur : id
      }
    })
    if (uti == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier not found'
      }
    }
    if (updateUtilisateurDto.idUtilisateur != id){
      return {
        status : HttpStatus.CONFLICT,
        error : 'Impossible to change ID'
      }
    }
    updateUtilisateurDto.dateModification = new Date();
    await this.utiRepo.update(id, updateUtilisateurDto);
    return await this.utiRepo.findOne(id);

  }

  async remove(id: number) {
    const uti = await this.utiRepo.findOne({
      where : {
        idUtilisateur : id
      }
    })
    if (uti == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
    try {
      await this.utiRepo.delete(id);
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

  async findUserOnCimaint (login: string, pwd:string) {
    const odbc = require('odbc');
    try {
      const co = await odbc.connect('DSN=EVNADMIN;Uid=XTC02SPA;Password=xtc02002');
      const res = await co.query('SELECT NOMUTILI, PRENOMUT FROM GEN99.GWUTI WHERE LOGINUTI = ? AND PASSWORD = ?', [login, pwd]);
      if (res.count == 0) {
        return undefined;
      }
      return res;
    } catch ( e :any) {
      console.log(e);
    }
    
  }


}
