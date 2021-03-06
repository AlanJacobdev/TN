import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DescriptionService } from 'src/description/description.service';
import { CreateDescriptionDto } from 'src/description/dto/create-description.dto';
import { NumerouniqueService } from 'src/numerounique/numerounique.service';
import { CreateOrsaveDto } from 'src/orsave/dto/create-orsave.dto';
import { OrsaveService } from 'src/orsave/orsave.service';
import { TypeobjetrepereService } from 'src/typeobjetrepere/typeobjetrepere.service';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { ILike, Repository } from 'typeorm';
import { CreateObjetrepereDto } from './dto/create-objetrepere.dto';
import { UpdateObjetrepereDto } from './dto/update-objetrepere.dto';
import { Objetrepere } from './entities/objetrepere.entity';

@Injectable()
export class ObjetrepereService {
  
  constructor(@InjectRepository(Objetrepere) private OrRepo : Repository<Objetrepere>, private nuservice : NumerouniqueService, private typeorservice : TypeobjetrepereService,  private orsaveservice : OrsaveService,
              private descriptionService: DescriptionService, private utilisateurService : UtilisateurService ){}

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
              error :'Num??ro Unique d??ja utilis??',
            }, HttpStatus.CONFLICT)
          }
        } else {
          return  {
            status : HttpStatus.CONFLICT,
            error :'L\'objet rep??re d??ja existant'
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
          libelleObjetRepere: "Num??ro secondaire de " + NUOrigine,
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
        error :'Probl??me lors de la cr??ation des objets rep??res'
      }
    } else {
      return  {
        status : HttpStatus.NOT_FOUND,
        message :'Cr??ation des objets rep??res effectu??e'
      }
    }
  }


  findAll() {
    return this.OrRepo.find({
      relations: ["description"],
      order : {
        idObjetRepere : "ASC"
      }
    });
  }

  findOne(id: string) {
    return this.OrRepo.findOne({ 
      where : {
          idObjetRepere : id
        },
      relations: ["description"],
      },
    )
  }

  findOneByNU(nu : string) {
    return this.OrRepo.findOne({
      select : ['libelleObjetRepere'],
      where : {
        numeroUnique : nu
      },
      relations: ["description"],
    })
  }

  getORByNU(nu : string) {
    return this.OrRepo.findOne({
      select : ['idObjetRepere','libelleObjetRepere'],
      where : {
        numeroUnique : nu
      },
      relations: ["description"],
    })
  }

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
        error :'Objet rep??re inconnu',
      }, HttpStatus.NOT_FOUND)
    }
    if(OR.libelleObjetRepere == updateObjetrepereDto.libelleObjetRepere 
      && OR.etat == updateObjetrepereDto.etat 
      && JSON.stringify(OR.description) === JSON.stringify(updateObjetrepereDto.description)){
        throw new HttpException({
          status : HttpStatus.NOT_MODIFIED,
          error :'Aucune modification effectu??e',
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
          error : 'Impossible de supprimer un objet dont vous n\'??tes pas le cr??ateur',
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
        error :'Impossible de supprimer l\'objet (item li??)',
      }
    }
    
    return {
      status : HttpStatus.OK,
      message :'Objet rep??re supprim??',
    }
  }

  async getHistory(idItem : string) {
    return await this.orsaveservice.findHistoryById(idItem);
  }


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
        error :'Il n\'y a pas l\'espace n??cessaire',
      }
      } else {
        return {
          status : HttpStatus.OK,
          message :'L\'espace est disponible',
        }
      }
      
    })
  }

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


  async getTypeOfItemsForOR(Atelier : string) {

    const res = await this.OrRepo.createQueryBuilder("Objetrepere")
    .select(['Objetrepere.codeType as idTypeObjet'])
    .where("Objetrepere.numeroUnique like :id", { id : Atelier.charAt(0) +'%'})
    .distinct()
    .getRawMany()
      
    return res;

  }


}

