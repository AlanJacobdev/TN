import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AtelierService } from 'src/atelier/atelier.service';
import { Atelier } from 'src/atelier/entities/atelier.entity';
import { Typeobjetrepere } from 'src/typeobjetrepere/entities/typeobjetrepere.entity';
import { TypeobjetrepereService } from 'src/typeobjetrepere/typeobjetrepere.service';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

/**
 * @author : @alanjacobdev
 * Classe appellée par un controleur. 
 * Manipule des données afin de les renvoyer au controleur après traitement
 */

@Injectable()
export class RoleService {

    /**
   * Constructeur de la classe 
   * Injection de Repository et autres services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
  constructor(@InjectRepository(Role) private roleRepository : Repository<Role>, @Inject(forwardRef(() => AtelierService)) private atelierService : AtelierService, private typeORService : TypeobjetrepereService, @Inject(forwardRef(() => UtilisateurService)) private utilisateurService :UtilisateurService){

  }

  /**
   * Création d'un rôle
   * @param createRoleDto : Informations utiles à la création d'un rôle
   * @returns Structure du nouveau rôle
   */
  async create(createRoleDto: CreateRoleDto) {
    let roleExist = await this.roleRepository.findOne({
      where : {
        libelleRole : createRoleDto.libelleRole
      }
    })
    if (roleExist == undefined) {
      let tabAtelier : Atelier[] = [];        
      if( createRoleDto.atelier !== null ) {
        for (const atelier of createRoleDto.atelier){
          let Atelier = await this.atelierService.findOne(atelier.idAtelier);
          if (Atelier != undefined) {
            tabAtelier.push(Atelier);
          }
        }
      }

      let tabTypeOR : Typeobjetrepere[] = [];        
      if( createRoleDto.typeObjet !== null ) {
        for (const typeOr of createRoleDto.typeObjet){
          let TypeOR = await this.typeORService.findOne(typeOr.idTypeOR);
          if (TypeOR != undefined) {
            tabTypeOR.push(TypeOR);
          }
        }
      }

      createRoleDto.typeObjet = tabTypeOR;
      createRoleDto.dateCreation = new Date();
      createRoleDto.atelier = tabAtelier;

      let newRole = this.roleRepository.create(createRoleDto);
      await this.roleRepository.save(newRole);
      return newRole;
    } else {
      return {
        status : HttpStatus.CONFLICT,
        error :'Rôle déjà existant',
      }
    }
  }

  /**
   * Retourne l'ensemble des rôles
   * @returns Liste des rôles existant
   */
  async findAll() {
    let role = await this.roleRepository.find({
      relations : ["atelier", "typeObjet"]
    })
    for (const d of role) {
      const profilC = await this.utilisateurService.findOneByLogin(d.profilCreation);
      if (profilC != undefined){
        d.profilCreation = profilC.nom.toUpperCase() + " " + profilC.prenom
      }
      if (d.profilModification != undefined){
        const profilM = await this.utilisateurService.findOneByLogin(d.profilModification);
        if (profilM != undefined){
          d.profilModification = profilM.nom.toUpperCase() + " " + profilM.prenom
        }
      }
    }
    return role
  }

  /**
   * Recherche un rôle en fonction de son identifiant
   * @param id : Identifiant du rôle
   * @returns Structure du rôle recherché ou undefined
   */
  findOne(id: number) {
    return this.roleRepository.findOne({
      where : {
        idRole : id
      },
      relations : ["atelier", "typeObjet"]
    })
  }


  /**
   * Retourne les ateliers lié à un rôle
   * @param idRole : Identifiant du rôle
   * @returns Liste des ateliers liés au rôle
   */
  async getAtelierFromRole(idRole : number){

    let atelier = await this.roleRepository.findOne({
      where : {
        idRole : idRole
      },
      relations : ["atelier"]
    })
    
    return atelier
  }

  /**
   * Retourne les types d'objet repères lié à un rôle
   * @param idRole : Identifiant du rôle
   * @returns Liste des types d'objet repères liés au rôle
   */
  async getTypeORFromRole(idRole : number){

    let atelier = await this.roleRepository.findOne({
      where : {
        idRole : idRole
      },
      relations : ["typeObjet"]
    })
    
    return atelier
  }


  /**
   * Modification d'un rôle
   * @param id : Identifiant du rôle
   * @param updateRoleDto : Informations a modifier
   * @returns Structure modifié du rôle ou erreur
   */
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({
      where : {
        idRole : id
      },
      relations : ["atelier", "typeObjet"]
    })
    if (role == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifiant non trouvé'
      }
    }

    let tabAtelier : Atelier[] = [];        
    if( updateRoleDto.atelier !== null ) {
      for (const atelier of updateRoleDto.atelier){
        let Atelier = await this.atelierService.findOne(atelier.idAtelier);
        if (Atelier != undefined) {
          tabAtelier.push(Atelier);
        }
      }
    }

    let tabTypeOR : Typeobjetrepere[] = [];        
      if( updateRoleDto.typeObjet !== null ) {
        for (const typeOr of updateRoleDto.typeObjet){
          let TypeOR = await this.typeORService.findOne(typeOr.idTypeOR);
          if (TypeOR != undefined) {
            tabTypeOR.push(TypeOR);
          }
        }
      }

    role.typeObjet = tabTypeOR;
    role.dateModification = new Date();
    role.atelier = tabAtelier;
    role.profilModification = updateRoleDto.profilModification;
    role.libelleRole = updateRoleDto.libelleRole;

    await this.roleRepository.save(role);
    
    return await this.findOne(id)

  }

  /**
   * Suppression d'un rôle
   * @param id : Identifiant du rôle
   * @returns Message de validation ou erreur
   */
  async remove(id: number) {
    const role = await this.roleRepository.findOne({
      where : {
        idRole : id
      },
      relations : ["atelier", "typeObjet"]
    })
    if (role == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifiant non trouvé'
      }
    }

    try {
      await this.roleRepository.delete(id)
    } catch ( e : any) {
      return {
        status : HttpStatus.CONFLICT,
        error :'Impossible de supprimer le rôle (utilisateur lié)',
      }
    }
    return {
      status : HttpStatus.OK,
      message :'Rôle supprimé',
    }


  }
}
