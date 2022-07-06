import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceService } from 'src/service/service.service';
import { Repository } from 'typeorm';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { Utilisateur } from './entities/utilisateur.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilisateurService {
  test() {
    throw new Error('Method not implemented.');
  }

  constructor(@InjectRepository(Utilisateur) private utiRepo: Repository<Utilisateur>, private serviceService: ServiceService){}
  
  async create(createUtilisateurDto: CreateUtilisateurDto) {
    const saltOrRounds = await bcrypt.genSalt();
    
    const service = await this.serviceService.findOne(createUtilisateurDto.idService);
    if (service != undefined) {
      const uti = await this.findOne(createUtilisateurDto.idUtilisateur);
      if (uti == undefined){
        createUtilisateurDto.dateCreation = new Date();
        createUtilisateurDto.password =  await bcrypt.hash(createUtilisateurDto.password, saltOrRounds)

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

  async findOneConnexion(login: string, password : string) {
    const user = await this.utiRepo.findOne({
      where : {
        login : login,
      }
    })
    if (user != undefined) {    
      const match = await bcrypt.compare(password, user.password)
      if (match) {
        return user;
      } else {
        return undefined
      }
    } else {
      return undefined;
    }
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


   async userExistOrNot(req : any, id : string, pwd : string) {
    console.log("req" + req);
    
    console.log("test");
    
    // const ActiveDirectory = require('activedirectory');
    // var config = new ActiveDirectory({
    //   url: 'ldap://GREDC01.even.fr:389',
    //   baseDN: 'DC=even,DC=fr',
    //   username: 'env.NAME',
    //   password: 'env.PWD'
    // })
    
    // const ad = config;
    // ad.authenticate(id, pwd, function(err, auth) {
    //   if (err) {
    //     console.log('Authentication failed!');
    //     return;
    //   }
    //   if (auth) {
    //     console.log(id + ' Authenticated!');
    //   }
    //   else {
    //     console.log('Authentication failed!');
    //   }
    // });

    
   }




}
