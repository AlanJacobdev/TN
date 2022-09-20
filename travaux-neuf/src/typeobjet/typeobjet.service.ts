import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { Repository } from 'typeorm';
import { CreateTypeobjetDto } from './dto/create-typeobjet.dto';
import { UpdateTypeobjetDto } from './dto/update-typeobjet.dto';
import { Typeobjet } from './entities/typeobjet.entity';

/**
 * @author : @alanjacobdev
 * Classe appellée par un controleur. 
 * Manipule des données afin de les renvoyer au controleur après traitement
 */

@Injectable()
export class TypeobjetService {

    /**
   * Constructeur de la classe 
   * Injection de Repository et autres services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(@InjectRepository(Typeobjet) private typeObjetRepo : Repository<Typeobjet>, private utilisateurService : UtilisateurService ){}

  /**
   * Creation d'un type d'objet
   * @param createTypeobjetDto : Informations utiles à la création
   * @returns Structure du nouveau type d'objet ou erreur
   */
  async create(createTypeobjetDto: CreateTypeobjetDto) {
    const typeobjet= await this.findOne(createTypeobjetDto.idType)
    if ( typeobjet == undefined){
      const checkLibelle = await this.checkLibelle(createTypeobjetDto.idType, createTypeobjetDto.libelleType);
      if(checkLibelle == undefined){
      createTypeobjetDto.dateCreation = new Date();
      const newTO = this.typeObjetRepo.create(createTypeobjetDto);
      await this.typeObjetRepo.save(newTO);
      return newTO;
      } else {
        return {
          status : HttpStatus.NOT_ACCEPTABLE,
          error : checkLibelle,
        }
      }
    } else {
      return {
        status : HttpStatus.CONFLICT,
        error :'Le type d\'objet existe déjà ',
      }
    }
    
  }

  /**
   * Vérifie le libelle d'un type d'objet repère (contrainte lié à l'identifiant)
   * @param typeObjet : Identifiant du type d'objet
   * @param libelle : Libelle du type d'objet
   * @returns Undefined(valide) ou string d'erreur
   */
  async checkLibelle(typeObjet : string, libelle : string){
    const startTO = typeObjet.charAt(0);     
    if ( startTO == 'A' || startTO == 'L' || startTO == 'V'){
      switch (startTO) {
        case 'A' :
          if (new RegExp("\\b"+"ana"+"\\b").test(libelle.toLowerCase())) {
            break;
          } else {
            return "Le libellé doit contenir le mot-clé 'ana'";
          }

        case 'L' : 
        if (new RegExp("\\b"+"tor"+"\\b").test(libelle.toLowerCase())) {
          break;
        } else {
          return "Le libellé doit contenir le mot-clé 'TOR'";
        }

        case 'V' : 
        if (new RegExp("\\b"+"vanne"+"\\b").test(libelle.toLowerCase())) {
          break;
        } else {
          return "Le libellé doit contenir le mot-clé 'Vanne'";
        }
      }
    }
    return undefined;
  }

  /**
   * Retourne l'ensemble des types d'objet existants
   * @returns 
   */
  async findAll() {
    const type = await this.typeObjetRepo.find({
      order : {
        idType : 'ASC'
      }
    });

    for (const t of type) {
      const profil = await this.utilisateurService.findOneByLogin(t.profilCreation);
      if (profil != undefined) {
        t.profilCreation = (profil.nom).toUpperCase() +" "+profil.prenom
      }

    }

    return type
  }

  /**
   * Retourne l'ensemble des type d'objet actifs
   * @returns 
   */
  findAllTypeOActif(){
    return this.typeObjetRepo.find({
      where : {
        actif : true
      }
    })
  }

  /**
   * Retourne un type d'objet 
   * @param id : Identifiant du type d'objet
   * @returns Structure du type d'objet ou undefined
   */
  findOne(id: string) {
    return this.typeObjetRepo.findOne({
      where : {
        idType : id
      }
    })
  }

  /**
   * Recherche l'identifiant, le libellé et l'état d'un type d'objet (par ordre croissant)
   * @returns Liste des types d'objets existant avec la contrainte de sélection
   */
  findAllType(){
    return this.typeObjetRepo.find({
      select:['idType','libelleType','actif'],
      order : {
        idType : "ASC"
      }
    })
  }

  /**
   * Recherche l'identifiant, le libellé et l'état d'un type d'objet ACTIF (par ordre croissant)
   * @returns Liste des types d'objets existant et ACTIF avec la contrainte de sélection
   */
  findAllTypeActif(){
    return this.typeObjetRepo.find({
      select:['idType','libelleType','actif'],
      where : {
        actif : true
      },
      order : {
        idType : "ASC"
      }
    })
  }

  /**
   * Modification d'un type d'objet
   * @param id : Identifiant du type d'objet
   * @param updateTypeobjetDto : Information a modifier
   * @returns Structure du type d'objet modifié ou erreur
   */
  async update(id: string, updateTypeobjetDto: UpdateTypeobjetDto) {
    const typeObjet = await this.typeObjetRepo.findOne({
      where : {
        idType : id
      }
    })
    if (typeObjet == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifiant du type d\'objet inconnu'
      }
    }
    if(updateTypeobjetDto.libelleType != undefined) {
      const checkLibelle = await this.checkLibelle(id, updateTypeobjetDto.libelleType);
      if(checkLibelle != undefined) {
        return {
          status : HttpStatus.NOT_FOUND,
          error : checkLibelle
        }
      }
    }
    updateTypeobjetDto.dateModification = new Date();
    await this.typeObjetRepo.update(id, updateTypeobjetDto);
    return await this.typeObjetRepo.findOne(id);

  }

  /**
   * Supprime un type d'objet
   * @param id : Identifiant du type d'objet
   * @returns Message de validation ou erreur
   */
  async remove(id: string) {
    const TypeObjet = await this.typeObjetRepo.findOne({
      where : {
        idType : id
      }
    })
    if (TypeObjet == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND);
    }
    try { 
      await this.typeObjetRepo.delete(id);
    } catch ( e: any ) {
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
