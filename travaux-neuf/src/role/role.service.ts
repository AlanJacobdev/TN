import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AtelierService } from 'src/atelier/atelier.service';
import { Atelier } from 'src/atelier/entities/atelier.entity';
import { Typeobjetrepere } from 'src/typeobjetrepere/entities/typeobjetrepere.entity';
import { TypeobjetrepereService } from 'src/typeobjetrepere/typeobjetrepere.service';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {

  constructor(@InjectRepository(Role) private roleRepository : Repository<Role>, private atelierService : AtelierService, private typeORService : TypeobjetrepereService){

  }

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

  findAll() {
    return this.roleRepository.find({
      relations : ["atelier", "typeObjet"]
    })
  }

  findOne(id: number) {
    return this.roleRepository.findOne({
      where : {
        idRole : id
      },
      relations : ["atelier", "typeObjet"]
    })
  }



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
        error :'Impossible de supprimer l\'item (sous-item lié)',
      }
    }
    return {
      status : HttpStatus.OK,
      message :'Rôle supprimé',
    }


  }
}
