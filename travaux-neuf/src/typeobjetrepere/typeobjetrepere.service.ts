import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { In, Repository } from 'typeorm';
import { CreateTypeobjetrepereDto } from './dto/create-typeobjetrepere.dto';
import { UpdateTypeobjetrepereDto } from './dto/update-typeobjetrepere.dto';
import { Typeobjetrepere } from './entities/typeobjetrepere.entity';

/**
 * @author : @alanjacobdev
 * Classe appellée par un controleur. 
 * Manipule des données afin de les renvoyer au controleur après traitement
 */

@Injectable()
export class TypeobjetrepereService {
  constructor(@InjectRepository(Typeobjetrepere) private TypeOrRepo : Repository<Typeobjetrepere>, @Inject(forwardRef(() => UtilisateurService)) private utilisateurService : UtilisateurService ){}

  async create(createTypeobjetrepereDto: CreateTypeobjetrepereDto) {
    const typeor = await this.findOne(createTypeobjetrepereDto.idTypeOR)
    if ( typeor == undefined){
      createTypeobjetrepereDto.dateCreation = new Date();
      const newOr = this.TypeOrRepo.create(createTypeobjetrepereDto);
      await this.TypeOrRepo.save(newOr);
      return newOr;
    } else {
      return {
        status : HttpStatus.CONFLICT,
        error :'Already exist',
      }
    }
  }

  async findAll() {
    const type = await this.TypeOrRepo.find({
      order : {
        idTypeOR : 'ASC'
      }
    });

    for ( const t of type) {
      const profil = await this.utilisateurService.findOneByLogin(t.profilCreation);      
      if (profil != undefined) {
        t.profilCreation = (profil.nom).toUpperCase() +" "+profil.prenom
      }
    }

    return type
  }

  findOne(id: string) {
    return this.TypeOrRepo.findOne({
      where :{
        idTypeOR : id
      }
    })
  }

     /**
   * Retourne l'ensemble des type d'objets répère autorisées triés par ordre croissant en fonction de leurs identifiants pour un utilisateur donné
   * @returns : Liste des types d'objet repère ou [] si aucun
   */
    async findAllTypeORForUser(profil: string) {
      let typeor = (await this.utilisateurService.getTypeORFromUser(profil)).typeObjet;
      let typeorAutorize = [];  
      for (const t of typeor) {
        typeorAutorize.push(t.idTypeOR)
      }
      
      return this.TypeOrRepo.find({
        where : {
          actif : true,
          idTypeOR : In(typeorAutorize)
        },
        order : {
          idTypeOR : "ASC"
        }
      })
    }



  async  update(id: string, updateTypeobjetrepereDto: UpdateTypeobjetrepereDto) {
    const typeor = await this.TypeOrRepo.findOne({
      where : {
        idTypeOR : id
      }
    })
    if (typeor == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier not found'
      }
    }

    updateTypeobjetrepereDto.dateModification = new Date();
    await this.TypeOrRepo.update(id, updateTypeobjetrepereDto);
    return await this.TypeOrRepo.findOne(id);


  }

  async remove(id: string) {
    const typeOr = await this.TypeOrRepo.findOne({
      where : {
        idTypeOR : id
      }
    })
    
    if( typeOr == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
    try {  
      await this.TypeOrRepo.delete(id)
    } catch (e : any) {
      return {
        status : HttpStatus.CONFLICT,
        error :'Impossible to delete',
      }
    }
    return {
      status : HttpStatus.OK,
      message :'Deleted',
    }
  }
}
