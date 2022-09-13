import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDescriptionDto } from './dto/create-description.dto';
import { UpdateDescriptionDto } from './dto/update-description.dto';
import { Description } from './entities/description.entity';

/**
 * @author : @alanjacobdev
 * Classe appellée par un controleur. 
 * Manipule des données afin de les renvoyer au controleur après traitement
 */

@Injectable()
export class DescriptionService {
  
  constructor(@InjectRepository(Description) private descriptionRepo : Repository<Description> ){
  }

  /**
   * Création d'une description
   * @param createDescriptionDto : Structure attendue pour la création d'une description
   * @returns La nouvelle description ou celle existant déjà
   */
  async create(createDescriptionDto: CreateDescriptionDto) {
    const descriptionExist = await this.descriptionRepo.findOne({
      where : {
        lien : createDescriptionDto.lien
      }
    })
    if (descriptionExist == undefined) {
      const newDescription = this.descriptionRepo.create(createDescriptionDto);
      const saveDescription = this.descriptionRepo.save(newDescription);
      return saveDescription;
    } else {
      return descriptionExist
    }

  }


  /**
   * Retourne la description donc le lien correspond à @param lien
   * @param lien : Lien de la decription (pouvant être du texte ou une URL)
   * @returns : Structure de la description recherché ou undefined si inconnu
   */
  findOneByLien(lien: string) {
    return this.descriptionRepo.findOne({
      where : {
        lien : lien
      }
    })
  }
  
  /**
   * Retourne la description donc l'identifiant correspond à @param id
   * @param id : Identifiant de la description
   * @returns Structure de la description recherché ou undefined si inconnu
   */
  findOneByID(id: number) {
    return this.descriptionRepo.findOne({
      where : {
        idDescription : id
      }
    })
  }

  /**
   * Modifie la description concernée en fonction des nouvelles données passée en paramètre
   * @param id : Identifiant de la description
   * @param updateDescriptionDto : Données modifiés de l'objet id
   * @returns Retourne la description modifiée ou un objet {status : HttpStatus, error : string}
   */
  async update(id: number, updateDescriptionDto: UpdateDescriptionDto) {
    const description = await this.descriptionRepo.findOne({
      where : {
        idDescription : id
      }
    })
    if (description == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Lien introuvable'
      }
    }
    await this.descriptionRepo.update(id, updateDescriptionDto);
    return await this.descriptionRepo.findOne(id);
    
  }

  /**
   * Supprime une description si elle n'est pas liée à d'autre objet.
   * @param id  Identifiant de la description à supprimer
   * @returns Retourne une HttpException ou un objet {status : HttpStatus, error : string} // {status : HttpStatus, message : string}
   */
  async remove(id: number) {
    const item = await this.descriptionRepo.findOne({
      where : {
        idDescription : id
      }
    })
    if(item == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Lien non trouvé',
      }, HttpStatus.NOT_FOUND);
    }

    try {
      await this.descriptionRepo.remove(item)
    } catch ( e : any) {
      return {
        status : HttpStatus.CONFLICT,
        error :'Impossible de supprimer la description (liée à d\'autre objets)',
      }
    }

    return {
      status : HttpStatus.OK,
      message :'Description supprimée',
    }

  }
}
