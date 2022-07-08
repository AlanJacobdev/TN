import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateParametreDto } from './dto/create-parametre.dto';
import { UpdateParametreDto } from './dto/update-parametre.dto';
import { Parametre } from './entities/parametre.entity';

@Injectable()

export class ParametreService {
  constructor(@InjectRepository(Parametre) private paramRepo : Repository<Parametre>){

  }
  async create(createParametreDto: CreateParametreDto) {
    
    let paramExist = this.findOne(createParametreDto.libelle); 
    if (paramExist != undefined) {
      createParametreDto.dateCreation = new Date();
      let newParam = this.paramRepo.create(createParametreDto);
      return await this.paramRepo.save(newParam);
    } else {
      return  {
        status : HttpStatus.CONFLICT,
        error :'Paramètre déjà existant avec le même libellé'
      }
    }
  }

  findAll() {
    return this.paramRepo.find();
  }

  findOne(libelle: string) {
    return this.paramRepo.findOne({
      where : {
        libelle : libelle
      }
    })
  }


  async updateEmail(libelle : string, updateParametreDto: UpdateParametreDto){
    let email = await this.findOne(libelle);
    if (email != undefined){
      let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");

      let isEmail = regex.test(email.valeur);
      if (isEmail) {
        email.valeur = updateParametreDto.valeur;
        email.dateModification = updateParametreDto.dateModification;
        email.profilModification = updateParametreDto.profilModification;
        email.posteModification = updateParametreDto.posteModification;
        await this.paramRepo.save(email);
        return this.findOne(libelle)
      } else {
        return  {
          status : HttpStatus.NOT_ACCEPTABLE,
          error :'Format d\'adresse mail incorrect'
        }
      }
    } else {
      return  {
        status : HttpStatus.NOT_FOUND,
        error :'Paramètre adresse mail inconnu'
      }
    }
  }

  async updateHeure(libelle : string, updateParametreDto: UpdateParametreDto){
    let heure = await this.findOne(libelle);
    if( heure != undefined) {
      let isNotNumber = isNaN(Number(updateParametreDto.valeur))
        if (isNotNumber == false) {
          heure.valeur = updateParametreDto.valeur;
          heure.profilModification = updateParametreDto.profilModification;
          heure.dateModification = updateParametreDto.dateModification;
          heure.posteModification = updateParametreDto.posteModification;
          await this.paramRepo.save(heure);
          return this.findOne(libelle)
        } else {
          return  {
            status : HttpStatus.NOT_FOUND,
            error :'Le nombre d\'heure n\'est pas un nombre'
          }
        }
    } else {
      return  {
        status : HttpStatus.NOT_FOUND,
        error :'Paramètre nombre d\'heure inconnu'
      }
    }

  }


  remove(id: number) {
    return `This action removes a #${id} parametre`;
  }
}
