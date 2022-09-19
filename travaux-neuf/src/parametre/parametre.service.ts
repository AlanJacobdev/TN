import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateParametreDto } from './dto/create-parametre.dto';
import { UpdateParametreDto } from './dto/update-parametre.dto';
import { Parametre } from './entities/parametre.entity';

/**
 * @author : @alanjacobdev
 * Classe appellée par un controleur. 
 * Manipule des données afin de les renvoyer au controleur après traitement
 */

@Injectable()

export class ParametreService {
  constructor(@InjectRepository(Parametre) private paramRepo : Repository<Parametre>){

  }

  /**
   * Création d'un paramètre
   * @param createParametreDto : Informations utiles à la création d'un paramètre
   * @returns Structure du nouveau paramètre 
   */
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

  /**
   * Retourne l'ensemble des paramètres
   * @returns Liste des paramètres existant
   */
  findAll() {
    return this.paramRepo.find();
  }

  /**
   * Retourne un paramètre en fonction de son libelle 
   * @param libelle : Libelle du paramètre
   * @returns Structure du paramètre recherché 
   */
  findOne(libelle: string) {
    return this.paramRepo.findOne({
      where : {
        libelle : libelle
      }
    })
  }


  /**
   * Met à jour l'adresse mail administrateur servant de réception aux demandes de suppressions
   * @param libelle : Libelle du paramètres (identifiant)
   * @param updateParametreDto : Informations à modifier
   * @returns Structure du paramètres mis à jour ou erreur
   */
  async updateEmail(libelle : string, updateParametreDto: UpdateParametreDto){
    let email = await this.findOne(libelle);
    if (email != undefined){
      let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");

      let isEmail = regex.test(updateParametreDto.valeur);
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


   /**
   * Met à jour le nombre d'heure pour lequel il est toujours possible de supprimer son propre objet (arborescence)
   * @param libelle : Libelle du paramètres (identifiant)
   * @param updateParametreDto : Informations à modifier
   * @returns Structure du paramètres mis à jour ou erreur
   */
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


}
