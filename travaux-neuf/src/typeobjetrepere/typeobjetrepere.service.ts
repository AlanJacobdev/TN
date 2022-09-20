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

  /**
   * Creation d'un type d'objet repère
   * @param createTypeobjetrepereDto : informations utiles à la création du type d'objet repère
   * @returns Structure du nouveau type d'objet repère ou erreur
   */
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

  /**
   * Retourne l'ensemble des type d'objet repère 
   * @returns Liste des type d"objet repères existants
   */
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

  /**
   * Retourne un type d'objet repère
   * @param id : Identifiant de l'objet repère
   * @returns Structure de l'objet repère ou undefined
   */
  findOne(id: string) {
    return this.TypeOrRepo.findOne({
      where :{
        idTypeOR : id
      }
    })
  }

    /**
 * Retourne l'ensemble des type d'objets répère autorisées triés par ordre croissant en fonction de leurs identifiants pour un utilisateur donné
 * @param profil : Identifiant de l'utilisateur à l'origine de la requête 
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

  /**
   * Modification d'un type d'objet repère
   * @param id : Identifiant du type d'objet repère
   * @param updateTypeobjetrepereDto : Modification a modifier
   * @returns Structure du type d'objet repère modifié ou erreur
   */
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

  /**
   * Suppression d'un type d'objet repère
   * @param id : Identifiant du type d'objet repère
   * @returns Message de valdiation ou erreur
   */
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
