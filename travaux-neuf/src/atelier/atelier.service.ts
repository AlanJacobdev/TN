import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { In, Repository } from 'typeorm';
import { CreateAtelierDto } from './dto/create-atelier.dto';
import { UpdateAtelierDto } from './dto/update-atelier.dto';
import { Atelier } from './entities/atelier.entity';

/**
 * @author : @alanjacobdev
 * Classe appellée par un controleur. 
 * Manipule des données afin de les renvoyer au controleur après traitement
 */

@Injectable()
export class AtelierService {


  constructor(@InjectRepository(Atelier) private AtelierRepo : Repository<Atelier> , private utilisateurService: UtilisateurService){}

  /**
   * Création d'un atelier 
   * @param createAtelierDto : Structure attendue pour la création d'un atelier
   * @returns : Le nouvel atelier ou une erreur
   */
  async create(createAtelierDto: CreateAtelierDto) {
    const atelier = await this.findOne(createAtelierDto.idAtelier);
    if ( atelier == undefined){
      createAtelierDto.dateCreation = new Date();
      const newAtelier = this.AtelierRepo.create(createAtelierDto);
      await this.AtelierRepo.save(newAtelier);
      return newAtelier;
    } else {
      return {
        status : HttpStatus.CONFLICT,
        error :'Exist déjà',
      }
    }
  }

  /**
   * Retourne l'ensemble des ateliers triés par ordre croissant en fonction de leurs identifiants
   * @returns : Liste des ateliers ou [] si aucun
   */
  findAll() {
    return this.AtelierRepo.find({
      order : {
        idAtelier : "ASC"
      }
    });
  }

  /**
   * Retourne l'ensemble des ateliers actifs triés par ordre croissant en fonction de leurs identifiants
   * @returns : Liste des ateliers ou [] si aucun
   */
  findAllAteliersActif(){
    return this.AtelierRepo.find({
      where : {
        actif : true
      },
      order : {
        idAtelier : "ASC"
      }
    })
  }

    /**
   * Retourne l'ensemble des ateliers actifs triés par ordre croissant en fonction de leurs identifiants pour un utilisateur donné
   * @returns : Liste des ateliers ou [] si aucun
   */
    async findAllAteliersActifForUser(profil : string){
      let atelier = (await this.utilisateurService.getAtelierFromUser(profil)).atelier;
      let atelierAutorize = [];  
      for (const a of atelier) {
        atelierAutorize.push(a.idAtelier)
      }
      
      return this.AtelierRepo.find({
        where : {
          actif : true,
          idAtelier : In(atelierAutorize)
        },
        order : {
          idAtelier : "ASC"
        }
      })
    }



  /**
   * Retourne l'atelier correspondant à l'identifiant id
   * @param id : Identifiant de l'atelier recherché
   * @returns : Structure de l'atelier recherché ou undefined si inconnu
   */
  findOne(id: string) {
    return this.AtelierRepo.findOne({
      where : {
        idAtelier : id
      }
    })
  }

  /**
   * Modifie l'atelier concerné en fonction des nouvelles données passée en paramètre
   * @param id : Identifiant de l'atelier à modifier
   * @param updateAtelierDto  : Données modifiés de l'objet id
   * @returns : Retourne l'atelier modifié ou un objet {status : HttpStatus, error : string}
   */
  async update(id: string, updateAtelierDto: UpdateAtelierDto) {
    const atelier = await this.AtelierRepo.findOne({
      where : {
        idAtelier : id
      }
    })

    if (atelier == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier not found'
    }
  }
    updateAtelierDto.dateModification = new Date();
    await this.AtelierRepo.update(id, updateAtelierDto);
    return await this.AtelierRepo.findOne(id);
  }


  /**
   * Supprime un atelier
   * @param id : Identifiant de l'atelier à supprimer
   * @returns Retourne une HttpException ou un objet {status : HttpStatus, error : string} // {status : HttpStatus, message : string}
   */
  async remove(id: string) {
    const Atelier = await this.AtelierRepo.findOne({
      where : {
        idAtelier : id
      }
    })
    if(Atelier == undefined){
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND);
    }
    try {
      await this.AtelierRepo.delete(id);
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
