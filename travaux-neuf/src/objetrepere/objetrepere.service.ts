import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DescriptionService } from 'src/description/description.service';
import { CreateDescriptionDto } from 'src/description/dto/create-description.dto';
import { NumerouniqueService } from 'src/numerounique/numerounique.service';
import { CreateOrsaveDto } from 'src/orsave/dto/create-orsave.dto';
import { OrsaveService } from 'src/orsave/orsave.service';
import { TypeobjetrepereService } from 'src/typeobjetrepere/typeobjetrepere.service';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { Brackets, ILike, In, Repository } from 'typeorm';
import { CreateObjetrepereDto } from './dto/create-objetrepere.dto';
import { UpdateObjetrepereDto } from './dto/update-objetrepere.dto';
import { Objetrepere } from './entities/objetrepere.entity';

/**
 * @author : @alanjacobdev
 */

@Injectable()
export class ObjetrepereService {
  
  constructor(@InjectRepository(Objetrepere) private OrRepo : Repository<Objetrepere>, private nuservice : NumerouniqueService, private typeorservice : TypeobjetrepereService,  private orsaveservice : OrsaveService,
              private descriptionService: DescriptionService, private utilisateurService : UtilisateurService ){}

  /**
   * Créer un objet repère
   * @param createObjetrepereDto : Structure attendue pour la création d'un objet repère
   * @returns : Le nouvel objet repère ou une erreur
   */
  async create(createObjetrepereDto: CreateObjetrepereDto) {
    const typeor = await this.typeorservice.findOne(createObjetrepereDto.codeType); 
    if (typeor != undefined) {
      const nu = await this.nuservice.findOne(createObjetrepereDto.numeroUnique);
      if(nu != undefined) {
        createObjetrepereDto.idObjetRepere = createObjetrepereDto.codeType + createObjetrepereDto.numeroUnique;
        const or = await this.findOne(createObjetrepereDto.idObjetRepere)
        if ( or == undefined){
          let tabDescription = [];

          if( createObjetrepereDto.description !== null ) {
          
            for (const desc of createObjetrepereDto.description){
              let newDescDTO:CreateDescriptionDto = {
                lien: desc.lien
              }
              const newDesc = await this.descriptionService.create(newDescDTO);
              let index = tabDescription.findIndex((element) => element.idDescription === newDesc.idDescription)
              if (index === -1) {
                tabDescription.push(newDesc)
              }
            }
          }
          try {
          createObjetrepereDto.dateCreation = new Date();
          createObjetrepereDto.description = tabDescription;
          const newOr = this.OrRepo.create(createObjetrepereDto);
          await this.OrRepo.save(newOr);
          return newOr;
          } catch (e:any){
            throw new HttpException({
              status : HttpStatus.CONFLICT,
              error :'Numéro Unique déja utilisé',
            }, HttpStatus.CONFLICT)
          }
        } else {
          return  {
            status : HttpStatus.CONFLICT,
            error :'L\'objet repère déja existant'
          }
        }
      } else {
        return  {
          status : HttpStatus.NOT_FOUND,
          error :'Le numero unique n\'existe pas'
        }
      } 
    } else {
      return  {
        status : HttpStatus.NOT_FOUND,
        error :'Le type d\'objet n\'existe pas'
      }
    }  
  }

  /**
   * Créer plusieurs objet en même temps 
   * @param createObjetrepereDto : Structure attendue pour la création d'objets repères
   * @returns : {status : HttpStatus, error : string} // {status : HttpStatus, message : string}
   */
  async createMultipleObject(createObjetrepereDto: CreateObjetrepereDto) {
    let range = createObjetrepereDto.rangeNu;
    let error = false;
    const NUOrigine = createObjetrepereDto.rangeNu[0];

    for(const nu of range){
      let createDto : any;
      if( nu == createObjetrepereDto.numeroUnique){
        createDto = {
          libelleObjetRepere: createObjetrepereDto.libelleObjetRepere,
          codeType: createObjetrepereDto.codeType,
          numeroUnique: createObjetrepereDto.numeroUnique,
          etat: 'A',
          description: createObjetrepereDto.description,
          profilCreation: createObjetrepereDto.profilCreation,
          posteCreation: createObjetrepereDto.posteCreation,
        };
      } else {
        createDto = {
          libelleObjetRepere: "Numéro secondaire de " + NUOrigine,
          codeType: createObjetrepereDto.codeType,
          numeroUnique: nu,
          etat: 'R',
          description: [],
          profilCreation: createObjetrepereDto.profilCreation,
          posteCreation: createObjetrepereDto.posteCreation,
        };
      }

      const res = await this.create(createDto);

      if (res.hasOwnProperty('error')){
        error = true;
      }
    }

    if (error == true) {
      return  {
        status : HttpStatus.NOT_FOUND,
        error :'Problème lors de la création des objets repères'
      }
    } else {
      return  {
        status : HttpStatus.OK,
        message :'Création des objets repères effectuée'
      }
    }
  }

  /**
   * Retourne la liste de tout les objets repères triés par ordre croissant de leurs identifiants avec leur descriptions
   * @returns Liste des objets repères ou [] si aucun
   */
  findAll() {
    return this.OrRepo.find({
      relations: ["description"],
      order : {
        idObjetRepere : "ASC"
      }
    });
  }

  /**
   * Retourne un objet repère correspondant à l'identifiant
   * @param id : Identifiant de l'objet repère
   * @returns : Structure de l'objet repère recherché ou undefined si inconnu
   */

  findOne(id: string) {
    return this.OrRepo.findOne({ 
      where : {
          idObjetRepere : id
        },
      relations: ["description"],
      },
    )
  }

  /**
   * Retourne le libellé avec un numéro unqiue correspond à @param nu avec ses descriptions 
   * @param nu Numéro unique
   * @returns Structure de l'objet repère recherché ou undefined si inconnu
   */
  findOneByNU(nu : string) {
    return this.OrRepo.findOne({
      select : ['libelleObjetRepere'],
      where : {
        numeroUnique : nu
      },
      relations: ["description"],
    })
  }

  /**
   * Retourne l'identifiant et le libellé d'un objet repère en fonction de son numero unique
   * @param nu Numéro unique
   * @returns Structure de l'objet repère recherché ou undefined si inconnu
   */
  getORByNU(nu : string) {
    return this.OrRepo.findOne({
      select : ['idObjetRepere','libelleObjetRepere'],
      where : {
        numeroUnique : nu
      },
      relations: ["description"],
    })
  }

  /**
   * Retourne la liste de l'ensemble des objets repère d'un atelier ordonné par identifiant de manière croissante + profil pour visualisation
   * @param id : Identifiant de l'atelier
   * @returns  Liste des Or ou [] si aucun
   */
  async getORByAtelier(id: string) {
    const or = await this.OrRepo.find({
      where : {
        numeroUnique : ILike(id+"%")
      },
      relations: ["description"],
      order : {
        idObjetRepere : "ASC"
      }
    })

    for (const o of or){
      const profilCreation = await this.utilisateurService.findOneByLogin(o.profilCreation)
      if (profilCreation != undefined){
        o.profilCreation = profilCreation.nom.toUpperCase() +" "+ profilCreation.prenom;
      }
      const profilModification = await this.utilisateurService.findOneByLogin(o.profilModification)
      if (profilModification != undefined){
        o.profilModification = profilModification.nom.toUpperCase() +" "+ profilModification.prenom;
      }
    }

    return or
  }

    /**
   * Retourne la liste de l'ensemble des objets repère d'un atelier ordonné par identifiant de manière croissante donné pour un utilisateur
   * @param id : Identifiant de l'atelier
   * @returns  Liste des Or ou [] si aucun
   */
     async getORByAtelierForOneUser(atelier: string, user : string) {
      let listeType = (await this.utilisateurService.getTypeORFromUser(user)).typeObjet;
      let listetypeAutorize = [];
      for (const t of listeType) {
        listetypeAutorize.push(t.idTypeOR);
      }
      const or = await this.OrRepo.find({
        where : {
          numeroUnique : ILike(atelier+"%"),
          codeType : In(listetypeAutorize)
        },
        relations: ["description"],
        order : {
          idObjetRepere : "ASC"
        }
      })
      return or
    }

  /**
   * Retourne l'ensemble des objets repère créé / modifier et non itemiser au sein de la GMAO
   */
  async getORforExportGMAO(){
    let res = await this.OrRepo.find({
      where : {
        exporte :  false
      },
      order : {
        dateCreation : "ASC",
        dateModification : "ASC"
      }
    })

    for (const o of res){
      const profilCreation = await this.utilisateurService.findOneByLogin(o.profilCreation)
      if (profilCreation != undefined){
        o.profilCreation = profilCreation.nom.toUpperCase() +" "+ profilCreation.prenom;
      }
      const profilModification = await this.utilisateurService.findOneByLogin(o.profilModification)
      if (profilModification != undefined){
        o.profilModification = profilModification.nom.toUpperCase() +" "+ profilModification.prenom;
      }
    }

    return res
  }

  /**
   * Modifie l'objet repère concerné en fonction des nouvelles données passées en paramètre + Créer une sauvegarde
   * @param id : Identifiant de l'objet repère
   * @param updateObjetrepereDto : Données modifiés de l'objet id
   * @returns  Retourne l'objet repère modifié ou un objet {status : HttpStatus, error : string} // HttpException
   */
  async update(id: string, updateObjetrepereDto: UpdateObjetrepereDto) {
    const OR = await this.OrRepo.findOne({
      where : {
        idObjetRepere : id
      },
      relations: ["description"],
    })
    if (OR == undefined){
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error :'Objet repère inconnu',
      }, HttpStatus.NOT_FOUND)
    }
    if(OR.libelleObjetRepere == updateObjetrepereDto.libelleObjetRepere 
      && OR.etat == updateObjetrepereDto.etat 
      && JSON.stringify(OR.description) === JSON.stringify(updateObjetrepereDto.description)){
        throw new HttpException({
          status : HttpStatus.NOT_MODIFIED,
          error :'Aucune modification effectuée',
        }, HttpStatus.NOT_FOUND)
    }

    let tabDescription = [];

    if( updateObjetrepereDto.description !== null ) {
    
      for (const desc of updateObjetrepereDto.description){
        let newDescDTO:CreateDescriptionDto = {
          lien: desc.lien
        }
        const newDesc = await this.descriptionService.create(newDescDTO);
        let index = tabDescription.findIndex((element) => element.idDescription === newDesc.idDescription)
        if (index === -1) {
          tabDescription.push(newDesc)
        }
      }
    }
 
    let dateModif : Date;
    let statusOr : string = "";
    const oldOr = await this.orsaveservice.findOnebyIDDesc(id);

    
    if ( oldOr == undefined || oldOr.status == 'D' ) {
      statusOr = 'C'
      dateModif = OR.dateCreation   
    } else {
      statusOr = 'M'
      dateModif = new Date();
    }

    let orsaveDto = new CreateOrsaveDto;
    orsaveDto = {
      idObjetRepere : OR.idObjetRepere,
      libelleObjetRepere : OR.libelleObjetRepere,
      codeType : OR.codeType,
      numeroUnique : OR.numeroUnique,
      etat : OR.etat,
      description : OR.description,
      date : dateModif,
      status : statusOr,
      profilModification : updateObjetrepereDto.profilModification,
      posteModification : updateObjetrepereDto.posteModification    
    }

    OR.libelleObjetRepere = updateObjetrepereDto.libelleObjetRepere;
    OR.etat = updateObjetrepereDto.etat;
    OR.description = tabDescription;
    OR.profilModification = updateObjetrepereDto.profilModification;
    OR.posteModification = updateObjetrepereDto.posteModification;
    OR.dateModification = new Date();

    await this.orsaveservice.create(orsaveDto);   
    await this.OrRepo.save(OR);
    return await this.OrRepo.findOne({
      where : {
        idObjetRepere : id
      },
      relations: ["description"]
    });
  }


  /**
   * Change le status d'exportation 
   * @param or identifiant Objet repère 
   * @param value Valeur du champ exporte
   * @returns HttpException ou l'objet repère modifié
   */
  async updateExportStatus(or : string, value : boolean){
    const OR = await this.OrRepo.findOne({
      where : {
        idObjetRepere : or
      },
      relations: ["description"],
    })
    if (OR == undefined){
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error :'Objet repère inconnu',
      }, HttpStatus.NOT_FOUND)
    }

    OR.exporte = value;

    await this.OrRepo.save(OR);
    return await this.OrRepo.findOne({
      where : {
        idObjetRepere : or
      },
      relations: ["description"]
    });
  }

  /**
   * 
   * @param id Identifiant de l'objet repère supprimé
   * @param user Utilisateur supprimant l'objet repère 
   * @param admin Est administrateur (facultatif)
   * @param date : Date de création (facultatif)
   * @returns Retourne une HttpException ou un objet {status : HttpStatus, error : string} // {status : HttpStatus, message : string}
   */
  async remove(id: string, user : string, admin? : boolean, date?: Date) {
    const OR = await this.OrRepo.findOne({
      where : {
        idObjetRepere : id,
      },
      relations: ["description"]
    })
    if ( OR == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Identifiant d\'objet inconnu',
      }, HttpStatus.NOT_FOUND);
    }
    
    if (!admin){
      if (OR.profilCreation !== user){
        return {
          status : HttpStatus.NOT_FOUND,
          error : 'Impossible de supprimer un objet dont vous n\'êtes pas le créateur',
        };
      }
    }
  
    const oldItem = await this.orsaveservice.findOnebyIDDesc(id);
    if ( oldItem == undefined || oldItem.status == 'D' ) {
      let OrCreateSaveDTO = new CreateOrsaveDto();
      OrCreateSaveDTO = {
        idObjetRepere : OR.idObjetRepere,
        libelleObjetRepere : OR.libelleObjetRepere,
        codeType : OR.codeType,
        numeroUnique : OR.numeroUnique,
        etat : OR.etat,
        description : OR.description,
        date : OR.dateCreation,
        status : "C",
        profilModification : user,
        posteModification : ""    
      }
      
      await this.orsaveservice.create(OrCreateSaveDTO);
    } 

    let deleteDateSave;
    if (date){
      deleteDateSave = date
    } else {
      deleteDateSave = new Date()
    }
    let orsaveDto = new CreateOrsaveDto;
    orsaveDto = {
      idObjetRepere : OR.idObjetRepere,
      libelleObjetRepere : OR.libelleObjetRepere,
      codeType : OR.codeType,
      numeroUnique : OR.numeroUnique,
      etat : OR.etat,
      description : OR.description,
      date : deleteDateSave,
      status : "D",
      profilModification : user,
      posteModification : ""    
    }
    
    await this.orsaveservice.create(orsaveDto);   

    try {
      await this.OrRepo.delete(id);
    } catch ( e : any) {
      await this.orsaveservice.remove(orsaveDto.idObjetRepere, orsaveDto.date);
      await this.orsaveservice.remove(orsaveDto.idObjetRepere, OR.dateCreation);
      return {
        status : HttpStatus.CONFLICT,
        error :'Impossible de supprimer l\'objet (item lié)',
      }
    }
    
    return {
      status : HttpStatus.OK,
      message :'Objet repère supprimé',
    }
  }


  /**
   * Retoune l'historique de l'objet idOr
   * @param idOR : Identifiant de l'objet repère
   * @returns Liste des différents états de l'objet repère ou [] si aucun
   */
  async getHistory(idOR : string) {
    return await this.orsaveservice.findHistoryById(idOR);
  }


  /**
   * Retourne la liste des numéros unqiues d'un atelier en précisant lesquels sont déjà créer
   * @param Atelier : Identifiant de l'atelier 
   * @returns Liste des 1000 nu complétée des OR existants
   */
  async getAllNUAndORByAtelier(Atelier : string) {
    let res= []
    let allNU = await this.nuservice.findAllOnlyID(Atelier);
    let allORByAtelier = await this.getORByAtelier(Atelier);
    for (const nu of allNU) {
      res.push({
        "numeroUnique" : nu.idNumeroUnique,
        "libelleOR" : ""
      })
    }
    for (const or of allORByAtelier) {
      let index = res.findIndex((element) => element.numeroUnique === or.numeroUnique)
      res[index] = {
        "numeroUnique" : or.numeroUnique,
        "libelleOR" : or.libelleObjetRepere
      }
    }
    return res;
  }

  /**
   * Calcul si il est possible ou non de faire un réservation pour la création d'un objet repère
   * @param Atelier : Identifiant de l'atelier
   * @param startNU : Numéro unique du premier Objet repèrer
   * @param additionalNU : Nombre d'objet repère à reserver
   * @returns : {status : HttpStatus, error : string} // {status : HttpStatus, message : string}
   */
   async reservationIsPossible(Atelier : string, startNU : string , additionalNU : number) {
    let allNU: string[]= []
    let res = true;
    let NU : number = +startNU.substring(1,4);
    let endingNU : number = NU + +additionalNU;
    let allORByAtelier =  await this.getORByAtelier(Atelier);
    const AllNU = new Promise(function(resolve, reject){
        for ( let i : number = NU ; i <= endingNU ; i++ ){
          allNU.push(Atelier + (i<10 ? '00' + i : (i<100 ?'0'+i : i)) );
        }
        resolve(allNU);
      })
     return await AllNU.then( function(data) {
      for (const or of allORByAtelier) {
        let index = allNU.findIndex((element) => element === or.numeroUnique)
        if (index != -1){
          res = false;
        }
      }
      if (!res) {
        return {
        status : HttpStatus.CONFLICT,
        error :'Il n\'y a pas l\'espace nécessaire',
      }
      } else {
        return {
          status : HttpStatus.OK,
          message :'L\'espace est disponible',
        }
      }
      
    })
  }

  /**
   * Permet le déplacement de la réservation lorsqu'elle est impossible dans le cas d'un premier emplacement
   * @param Atelier : Identifiant de l'atelier
   * @param startIteration : Numero unique du début de l'interval de réservation
   * @param bookOR : Nombre d'or supplémentaire à créer
   * @param isForward : Vers l'avant
   * @returns : {status : HttpStatus, error : string} // {range : number, endIndex : string}
   */
  async getRangeToCreateOR(Atelier : string, startIteration : number, bookOR : number, isForward? : boolean){
    let startIter = +startIteration;
    let allORByAtelier = await this.getORByAtelier(Atelier);
    let flag = false;
    let indexExist = false;
    let indexBloquant = 0;
    let res = [];
    let endingNU = 0;

    const AllNU = new Promise(function(resolve, reject){
      let moveForward: boolean | undefined;
      if (isForward == undefined) {
        moveForward = undefined
      } else if (isForward.toString() === "true") {
        moveForward = true;
      } else if (isForward.toString() === "false"){
        moveForward = false;
      } 
      
      if (moveForward === true ) {
        startIter = startIter+1;
      } else if (moveForward === false){
        startIter = startIter-1;
      } 
      
      
      while(!flag) {
        if(moveForward === true || moveForward == undefined){
          endingNU = startIter + +bookOR;
          for ( let i : number = startIter ; i <= endingNU && !indexExist; i++ ){
            let index = allORByAtelier.findIndex((element) => element.numeroUnique === Atelier + (i<10 ? '00' + i : (i<100 ?'0'+i : i)) )
            if(index != -1){
              indexExist = true;
              indexBloquant = i;
            }
          }
        } else {
          endingNU = startIter + +bookOR;
          for ( let i : number = endingNU ; i >= startIter && !indexExist; i-- ){
            let index = allORByAtelier.findIndex((element) => element.numeroUnique === Atelier + (i<10 ? '00' + i : (i<100 ?'0'+i : i)) )
            if(index != -1){
              indexExist = true;
              indexBloquant = i;
            }
          }
        }
        if (endingNU >= 1000 || endingNU < 0){
          flag = true;
          reject("error")
        }
        if(indexExist) {
          if (moveForward == true) {
            startIter = indexBloquant+1;
          } else if (moveForward == false){
            startIter = startIter -1;
          }
          indexExist = false;
        } else {
          flag = true;
          if (moveForward == true || moveForward == undefined){
            for ( let i : number = startIter ; i <= endingNU ; i++ ){
              res.push(Atelier + (i<10 ? '00' + i : (i<100 ?'0'+i : i)) );
            }
          } else if (moveForward == false) {
            for ( let i : number = startIter ; i <= endingNU ; i++ ){
              res.push(Atelier + (i<10 ? '00' + i : (i<100 ?'0'+i : i)) );
            }
          }
          let data = {
            range : res,
            endIndex : startIter
          }
          resolve(data);
        }
      }
    })
   return await AllNU.then( function(data) {
    
    
    return data

  }).catch( function(){
     
    return {
      status : HttpStatus.CONFLICT,
      error :'Impossible d\'effectuer cela',
    }
  })

  }

  /**
   * Retourne l'ensemble des types d'objet d'un atelier
   * @param Atelier identifiant de l'Atelier
   * @returns Liste de tout les types d'objet repère d'un Atelier ou [] si aucun
   */
  async getTypeOfItemsForOR(Atelier : string) {

    const res = await this.OrRepo.createQueryBuilder("Objetrepere")
    .select(['Objetrepere.codeType as idTypeObjet'])
    .where("Objetrepere.numeroUnique like :id", { id : Atelier.charAt(0) +'%'})
    .distinct()
    .getRawMany()
      
    return res;

  }

  /**
   * Créer des objets repère sauvegardé au statut DAR ( demande admin refusée) pour permettre leur consultations après traitement 
   * @param listeOR Liste des objets repères à sauvegarder 
   * @param profil profil du créateur
   * @param date Date de création
   */
  async createORForDemandeRefuse(listeOR : string[], profil : string, date : Date) {
    for (const or of listeOR) {
      let orExist = await this.findOne(or);
      let createOrsaveDto :CreateOrsaveDto = {
        idObjetRepere: orExist.idObjetRepere,
        libelleObjetRepere: orExist.libelleObjetRepere,
        codeType: orExist.codeType,
        numeroUnique: orExist.numeroUnique,
        etat: orExist.etat,
        description: orExist.description,
        status: 'DAR',
        date: date,
        profilModification: profil,
        posteModification: ''
      };      
      await this.orsaveservice.create(createOrsaveDto);
    }
  }

}

