import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AtelierService } from 'src/atelier/atelier.service';
import { Repository } from 'typeorm';
import { CreateNumerouniqueDto } from './dto/create-numerounique.dto';
import { UpdateNumerouniqueDto } from './dto/update-numerounique.dto';
import { Numerounique } from './entities/numerounique.entity';

/**
 * @author : @alanjacobdev
 */

@Injectable()
export class NumerouniqueService {
  
  constructor(@InjectRepository(Numerounique) private NuRepo : Repository<Numerounique>, private atelierService: AtelierService){}

  /**
   * Création d'un numéro unique
   * @param createNumerouniqueDto : Structure attendue pour la création d'un numéro unique
   * @returns : Le nouveau numéro unique ou une erreur
   */
  async create(createNumerouniqueDto: CreateNumerouniqueDto) {
    const AtelierExist = await this.atelierService.findOne(createNumerouniqueDto.idAtelier.idAtelier);
    if(AtelierExist == undefined){
      const numeroExist = await this.findOne(createNumerouniqueDto.idNumeroUnique);
      if(numeroExist == undefined) {
        createNumerouniqueDto.dateCreation = new Date();
        const NU = this.NuRepo.create(createNumerouniqueDto);
        await this.NuRepo.save(NU);
        return NU;
      } else {
        return {
          status : HttpStatus.CONFLICT,
          error : "Already Exist"
        }
      }
    } else {
      return {
        status : HttpStatus.NOT_FOUND,
        error : "Atelier Not found"
      }
    }
  }

  /**
   * Retourne l'ensemble des numéros uniques 
   * @returns : Liste des numéros uniques ou [] si aucun
   */
  findAll() {
    return this.NuRepo.find();
  }

  /**
   * Retourne l'ensemble des numéros unique d'un atelier
   * @param atelier : Identifiant de l'atelier 
   * @returns Liste des numéros unique d'un atelier
   */
  findAllOnlyID(atelier:string) {
    return this.NuRepo.find({
      select : ['idNumeroUnique'],
      where : {
        idAtelier : atelier,
      }
    });
  }
  
  /**
   * Retourne un numéro unique 
   * @param id : Identifiant numéro unique
   * @returns Structure du numéro unique ou undefined si inconnu
   */
  findOne(id: string) {
    return this.NuRepo.findOne({
      where : {
        idNumeroUnique : id
      }
    })
  }

  /**
   * Modifie le numéro unique concerné en fonction des nouvelles données passées en paramètre
   * @param id : Identifiant du numéro unique
   * @param updateNumerouniqueDto : Données modifiés de l'objet id
   * @returns Retourne le numéro unique modifié ou un objet {status : HttpStatus, error : string}
   */
  async update(id: string, updateNumerouniqueDto: UpdateNumerouniqueDto) {
    
    const Nu = await this.NuRepo.findOne(id)
    if( Nu == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier Not Found'
      }
    }
    updateNumerouniqueDto.dateModification = new Date();
    await this.NuRepo.update(id, updateNumerouniqueDto);
    return await this.NuRepo.findOne(id);
}

  /**
   * Supprime un numéro unique 
   * @param id Identifiant du numéro unique 
   * @returns Retourne une HttpException ou un objet {status : HttpStatus, error : string} // {status : HttpStatus, message : string}
   */
  async remove(id: string) {
    const Nu = await this.NuRepo.findOne({
      where : {
        idNumeroUnique : id
      }
    })
    
    if(Nu == undefined){
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Not Found',
      }, HttpStatus.NOT_FOUND)
    }
    try {
      await this.NuRepo.delete(id)
    } catch ( e : any){
      return {
        status : HttpStatus.CONFLICT,
        error :'Impossible to delete',
      }
    }
    return {
      status : HttpStatus.OK,
      message  :'Deleted',
    }
    
  }
}
