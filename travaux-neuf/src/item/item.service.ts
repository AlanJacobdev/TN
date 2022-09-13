import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DescriptionService } from 'src/description/description.service';
import { CreateDescriptionDto } from 'src/description/dto/create-description.dto';
import { CreateItemsaveDto } from 'src/itemsave/dto/create-itemsave.dto';
import { ItemsaveService } from 'src/itemsave/itemsave.service';
import { ObjetrepereService } from 'src/objetrepere/objetrepere.service';
import { TypeobjetService } from 'src/typeobjet/typeobjet.service';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { Brackets, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';


/**
 * @author : @alanjacobdev
 * Classe appellée par un controleur. 
 * Manipule des données afin de les renvoyer au controleur après traitement
 */

@Injectable()
export class ItemService {
  
  constructor(@InjectRepository(Item) private itemRepo : Repository<Item> , private typeObjetService : TypeobjetService, private OrService : ObjetrepereService, private itemSaveService : ItemsaveService,
              private descriptionService: DescriptionService, private utilisateurService : UtilisateurService){}
  
  /**
   * Création d'un item
   * @param createItemDto : Structure attendue pour la création d'un item
   * @returns : Le nouvel item ou une erreur 
   */
  async create(createItemDto: CreateItemDto) {
 
    if (createItemDto.idOR.substring(2,6) !== createItemDto.numeroUnique) {
      return {
        status : HttpStatus.NOT_FOUND,
        error :'Le numéro unique de l\'item ne correspond pas à celui de l\'objet repère',
      }
    }
    const objetrepere = await this.OrService.findOne(createItemDto.idOR);
    if( objetrepere != undefined) {
      const typeObjet = await this.typeObjetService.findOne(createItemDto.codeObjet);
      if (typeObjet != undefined){
        const idWithSec = createItemDto.codeObjet + createItemDto.numeroUnique + createItemDto.digit + "Z" ;
        const itemWithSec = await this.findOne(idWithSec)
        const idWithoutSec = createItemDto.codeObjet + createItemDto.numeroUnique + createItemDto.digit ;
        const itemWithoutSec = await this.findOne(idWithoutSec);
       
        if (itemWithSec != undefined || itemWithoutSec != undefined) {
          return {
            status : HttpStatus.CONFLICT,
            error :'Item déjà existant',
          }
        }

        if(createItemDto.securite) {
          createItemDto.idItem = idWithSec;
        }else{
          createItemDto.idItem = idWithoutSec;
        }

        let tabDescription = [];
        
        
        if( createItemDto.description !== null ) {
        
          for (const desc of createItemDto.description){
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

        createItemDto.exporte = false;
        createItemDto.dateCreation = new Date();
        createItemDto.description = tabDescription;
        const newItem = this.itemRepo.create(createItemDto);
        await this.itemRepo.save(newItem);
        return newItem;
      } else {
        return {
          status : HttpStatus.NOT_FOUND,
          error :'Code Objet n\'existe pas',
        }
      }
    } else {
      return {
        status : HttpStatus.NOT_FOUND,
        error :'Objet Repere n\'existe pas',
      }
    }
  }

  /**
   * Retourne l'ensemble des items triés par ordre croissant en fonction de leurs identifiants
   * @returns Liste des items ou [] si aucun
   */
  findAll() {
    return this.itemRepo.find({
      relations: ["description"],
      order : {
        idItem : "ASC"
      }
    });
  }

  /**
   * Retourne l'item correspondant à l'identifiant id
   * @param id : Identifiant de l'item
   * @returns Structure de l'atelier recherché ou undefined si inconnu
   */
  findOne(id: string) {
    return this.itemRepo.findOne({
      where : {
        idItem : id
      },
      relations: ["description"]
    })
  }

  /**
   * Retourne tout les items appartenant à un Objet repère en les triant par ordre croissant de leurs identifiants
   * @param id : Identifiant de l'objet repère
   * @returns Liste des items dépendant d'un Objet repère ou [] si aucun
   */
  findAllItemOfOR (id : string) {
    return this.itemRepo.find({
      where : {
        idOR : id
      },
      relations: ["description"],
      order : {
        idItem : "ASC"
      }
    })
  }


  /**
   * Retourne tout les items appartenant à un Objet repère en les triant par ordre croissant de leurs identifiants avec le profil destiné à l'affichage
   * @param id : Identifiant de l'objet repère
   * @returns : Liste des items triés par ordre croissant de leur identifiant 
   */
  async getItemByORAffichage(id: string) {
    const item = await this.itemRepo.find({
      where : {
         idOR : id
      },
      relations: ["description"],
      order : {
        idItem : "ASC"
      }
    })

    for (const i of item) {
      const profilCreation = await this.utilisateurService.findOneByLogin(i.profilCreation)
      if (profilCreation != undefined){
        i.profilCreation = profilCreation.nom.toUpperCase() +" "+ profilCreation.prenom;
      }
      const profilModification = await this.utilisateurService.findOneByLogin(i.profilModification)
      if (profilModification != undefined){
        i.profilModification = profilModification.nom.toUpperCase() +" "+ profilModification.prenom;
      }
    }

    return item;
  }

    /**
   * Retourne l'ensemble des items créé / modifier et non itemiser au sein de la GMAO pour un utilisateur donné (restriction des ateliers et type d'objet parent)
   */
  async getItemforExportGMAOForOneUser(user : string){
    
    let atelier = (await this.utilisateurService.getAtelierFromUser(user)).atelier;
    let typeor = (await this.utilisateurService.getTypeORFromUser(user)).typeObjet;
    let atelierAutorize = [];
    for (const a of atelier) {
      atelierAutorize.push(a.idAtelier);
    }
    let listetypeAutorize = [];
    for (const t of typeor) {
      listetypeAutorize.push(t.idTypeOR);
    }

    const res = this.itemRepo.createQueryBuilder("Item")
      .select('Item')
      .where("Item.exporte = false")
      res.andWhere(new Brackets(qb=>{
      let i =0;
        for (const type of listetypeAutorize){
          const queryName = `query_${i}`;
          qb.orWhere(`Item.idOR like :${queryName}`, {[queryName]: type+ '%' })
          i = i+1;
        }
      }));

      res.andWhere(new Brackets(qb=>{
        let i =0;
          for (const atelier of atelierAutorize){
            const queryName = `query_${i}`;
            qb.orWhere(`Item.numeroUnique like :${queryName}`, {[queryName]: atelier.charAt(0) +'%'})
            i = i+1;
          }
        }));

      res.orderBy("Item.dateCreation", "ASC")
      res.addOrderBy("Item.dateModification", "ASC")
      
      let result =  await res.getMany();

    for (const o of result){
      const profilCreation = await this.utilisateurService.findOneByLogin(o.profilCreation)
      if (profilCreation != undefined){
        o.profilCreation = profilCreation.nom.toUpperCase() +" "+ profilCreation.prenom;
      }
      const profilModification = await this.utilisateurService.findOneByLogin(o.profilModification)
      if (profilModification != undefined){
        o.profilModification = profilModification.nom.toUpperCase() +" "+ profilModification.prenom;
      }
    }

    return result

  }

  /**
   * Retourne l'ensemble des items créé / modifier et non itemiser au sein de la GMAO
   * @returns Liste des items créés / modifiés.
   */
  async getItemforExportGMAO (){
    let res = await this.itemRepo.find({
        where : {
          exporte :  false
        },
        order : {
          dateCreation : "ASC",
          dateModification : "ASC"
        }
      })
      for (const item of res){
        const profilCreation = await this.utilisateurService.findOneByLogin(item.profilCreation)
        if (profilCreation != undefined){
          item.profilCreation = profilCreation.nom.toUpperCase() +" "+ profilCreation.prenom;
        }
        const profilModification = await this.utilisateurService.findOneByLogin(item.profilModification)
        if (profilModification != undefined){
          item.profilModification = profilModification.nom.toUpperCase() +" "+ profilModification.prenom;
        }
      }
      return res
  }

  /**
   * Retourne tout les items appartenant à un Objet repère en les triant par ordre croissant de leurs identifiants
   * @param id : Identifiant de l'objet repère
   * @returns Liste des items dépendant d'un Objet repère ou [] si aucun
   */
  async getItemByOR(id: string) {
    const item = await this.itemRepo.find({
      where : {
         idOR : id
      },
      relations: ["description"],
      order : {
        idItem : "ASC"
      }
    })
    return item;
  }

  /**
   * Retourne les items dépendant d'un objet repère et du type @param type
   * @param id : Identifiant de l'objet repère
   * @param type : Type d'objet de l'item
   * @returns Liste des items correspodnant aux critères ou [] si aucun
   */
  getItemByORAndType(id: string, type : string) {
    return this.itemRepo.find({
      where : {
         idOR : id,
         codeObjet : type
      },
      order : {
        idItem : "ASC"
      }
    })
  }

  /**
   * Modifie l'item concerné en fonction des nouvelles données passées en paramètre
   * @param id : Identifiant de l'item à modifier
   * @param updateItemDto : Données modifiés de l'item correspodnant à id
   * @returns Retourne l'item modifié ou un objet {status : HttpStatus, error : string} // HttpException
   */
  async update(id: string, updateItemDto: UpdateItemDto) {
    const item = await this.itemRepo.findOne({
      where : {
        idItem : id
      },
      relations : ["description"]
    })
    if (item == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifiant non trouvé'
      }
    }
 
    if(item.libelleItem == updateItemDto.libelleItem 
      && item.etat == updateItemDto.etat 
      && JSON.stringify(item.description) === JSON.stringify(updateItemDto.description)){
        throw new HttpException({
          status : HttpStatus.NOT_MODIFIED,
          error :'Aucune modification effectuée',
        }, HttpStatus.NOT_FOUND)

    }

    let tabDescriptionAfter = [];

    if( updateItemDto.description !== null ) {
     
      for (const desc of updateItemDto.description){
        let newDescDTO:CreateDescriptionDto = {
          lien: desc.lien
        }
        const newDesc = await this.descriptionService.create(newDescDTO);
        let index = tabDescriptionAfter.findIndex((element) => element.idDescription === newDesc.idDescription)
        if (index === -1) {
          tabDescriptionAfter.push(newDesc)
        }
      }
    }
   
    let statusItem : string = "";
    let dateModif : Date;
    const oldItem = await this.itemSaveService.findOnebyIDDesc(id);
    
    if ( oldItem == undefined || oldItem.status == 'D' ) {
      statusItem = 'C'
      dateModif = item.dateCreation     
    } else {
      statusItem = 'M'
      dateModif = item.dateModification;
    }
    let itemSaveDTO = new CreateItemsaveDto();
    itemSaveDTO = {
      idItem : item.idItem,
      libelleItem : item.libelleItem,
      idOR : item.idOR,
      codeObjet : item.codeObjet,
      numeroUnique : item.numeroUnique,
      digit : item.digit,
      securite : item.securite,
      etat : item.etat,
      status : statusItem,
      description : item.description,
      date : dateModif,
      profilModification : updateItemDto.profilModification,
      posteModification : updateItemDto.posteModification
    }

    
    await this.itemSaveService.create(itemSaveDTO);
    item.dateModification = new Date;
    item.libelleItem = updateItemDto.libelleItem;
    item.etat = updateItemDto.etat;
    item.description = tabDescriptionAfter;
    item.profilModification = updateItemDto.profilModification;
    item.posteModification = updateItemDto.posteModification;
    await this.itemRepo.save(item);
    await this.updateExportStatus(id, false);
    return await this.itemRepo.findOne({
      where : {
        idItem : id
      },
      relations : ["description"]
    });

  }


    /**
   * Change le status d'exportation 
   * @param or identifiant Item 
   * @param value Valeur du champ exporte
   * @returns HttpException ou l'item modifié
   */
     async updateExportStatus(item : string, value : boolean){
      const Item = await this.itemRepo.findOne({
        where : {
          idItem : item
        },
        relations: ["description"],
      })
      if (Item == undefined){
        throw new HttpException({
          status : HttpStatus.NOT_FOUND,
          error :'Item inconnu',
        }, HttpStatus.NOT_FOUND)
      }
  
      Item.exporte = value;
  
      await this.itemRepo.save(Item);
      return await this.itemRepo.findOne({
        where : {
          idItem : item
        },
        relations: ["description"]
      });
    }

  /**
   * Supprime un item
   * @param id : Identifiant de l'item
   * @param user : Profil de l'utilisateur 
   * @param admin : Est administrateur ou non (Facultatif)
   * @param date : Date de suppression (facultatif)
   * @returns Retourne une HttpException ou un objet {status : HttpStatus, error : string} // {status : HttpStatus, message : string}
   */
  async remove(id: string, user : string, admin? : boolean, date? : Date) {
    const item = await this.itemRepo.findOne({
      where : {
        idItem : id
      },
      relations: ["description"]
    })
    if(item == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Item non trouvé',
      }, HttpStatus.NOT_FOUND);
    }

      if (!admin){
        if (item.profilCreation !== user){
          return {
            status : HttpStatus.NOT_FOUND,
            error : 'Impossible de supprimer un objet dont vous n\'êtes pas le créateur',
          };
        }
      }

      const oldItem = await this.itemSaveService.findOnebyIDDesc(id);

      if ( oldItem == undefined || oldItem.status == 'D' || oldItem.status == 'M' ||  oldItem.status == 'C') {
    
        let dateDel : Date;
        let statusOr : string = "";
        if ( oldItem == undefined || oldItem.status == 'D' ) {
          statusOr = 'C'
          dateDel = item.dateCreation   
        } else if (oldItem.status == 'M' || oldItem.status == 'C'){
          statusOr = 'M'
          dateDel = item.dateModification;
        }

        let itemCreateSaveDTO = new CreateItemsaveDto();
        itemCreateSaveDTO = {
          idItem : item.idItem,
          libelleItem : item.libelleItem,
          idOR : item.idOR,
          codeObjet : item.codeObjet,
          numeroUnique : item.numeroUnique,
          digit : item.digit,
          securite : item.securite,
          etat : item.etat,
          status : statusOr,
          description : item.description,
          date : dateDel,
          profilModification : user,
          posteModification : ""
        }    
        
        await this.itemSaveService.create(itemCreateSaveDTO);
      } 
  
      let deleteDateSave;
      if (date){
        deleteDateSave = date
      } else {
        deleteDateSave = new Date()
      }


      let itemSaveDTO = new CreateItemsaveDto();
      itemSaveDTO = {
        idItem : item.idItem,
        libelleItem : item.libelleItem,
        idOR : item.idOR,
        codeObjet : item.codeObjet,
        numeroUnique : item.numeroUnique,
        digit : item.digit,
        securite : item.securite,
        etat : item.etat,
        status : "D",
        description : item.description,
        date : deleteDateSave,
        profilModification : user,
        posteModification : ""
        }    
      await this.itemSaveService.create(itemSaveDTO);
      try {
        await this.itemRepo.delete(id)
      } catch ( e : any) {
        await this.itemSaveService.remove(itemSaveDTO.idItem, item.dateCreation);
        await this.itemSaveService.remove(itemSaveDTO.idItem, itemSaveDTO.date);
        return {
          status : HttpStatus.CONFLICT,
          error :'Impossible de supprimer l\'item (sous-item lié)',
        }
      }
      return {
        status : HttpStatus.OK,
        message :'Item supprimé',
      }
  }

  /**
   * Retourne l'historique de modification d'un Item 
   * @param idItem : Identifiant de l'item
   * @returns Liste des anciens etats de l'objet ou [] si aucun
   */
  async getHistory(idItem : string) {
    return await this.itemSaveService.findHistoryById(idItem);
  }

  /**
   * Retourne la liste des items d'un objet repère correspondant à un type d'objet (création)
   * @param idOr : Identifiant de l'objet repère parent
   * @param type : Type d'objet
   * @returns Liste de 10 items correpondant au type
   */
  async getItemFromOrAndDispo(idOr : string, type : string){
    let ItemByORAndType = await this.getItemByOR(idOr);
    let itemAndDispo= [];
    for (let i = 0 ; i<10; i++){
      itemAndDispo.push({
        "idItem" : type + idOr.substring(2,6) + i,
        "libelle" : ""
      })
    }
    for (const item of ItemByORAndType) {
     
      let index = itemAndDispo.findIndex((element) => element.idItem === item.idItem || element.idItem + 'Z' === item.idItem)
      itemAndDispo[index] = {
        "idItem" : item.idItem,
        "libelle" : item.libelleItem
      }
      if(index == -1) {
        if(item.codeObjet == type){
          itemAndDispo.push({
            "idItem" : item.idItem,
            "libelle" : item.libelleItem
          })
        }
      }
    }
    return itemAndDispo;
  }

  /**
   * Retourne l'ensemble des types d'item appartenant à un objet repère
   * @param idOR : Identifiant d'objet repère
   * @returns : Liste des type d'item ou [] si aucun 
   */
  async getTypeOfItemsOfOR(idOR : string) {

    const res = await this.itemRepo.createQueryBuilder("Item")
    .select(['Item.codeObjet as idTypeObjet'])
    .where("Item.idOR = :id", { id : idOR})
    .distinct()
    .getRawMany()
    return res;

  }

  /**
   * Retourne la liste des items en correspondance avec les filtres @param
   * @param atelier : Identifiant de l'atelier
   * @param typeObjet : Identifiant d'un type d'objet
   * @param objetRepere : Identifiant d'un objet repère Parent
   * @param dateDebut : Début d'intervalle sur la dernière activité effectué sur l'item
   * @param dateFin : Fin d'intervalle sur la dernière activité effectué sur l'item
   * @param etat : Etat de l'item
   * @param estSecurite : L'item est un item de sécurité
   * @returns 
   */
  async getItemForExport(atelier : string, typeObjet : string, objetRepere : string, dateDebut : string, dateFin : string, etat : string, estSecurite : string){
    let date: Date;
   
    date = new Date(dateFin)
    date.setDate(date.getDate()+1)
    

    const result = this.itemRepo.createQueryBuilder("Item")
    .select(["Item.idItem, Item.libelleItem"])
    .where("1=1")
    
    if(atelier != '-1'){
      result.andWhere("Item.numeroUnique like :atelier", {atelier : `${atelier}%`})
    }
    if(typeObjet != '-1'){
      result.andWhere("Item.codeObjet = :typeObjet", {typeObjet : typeObjet.toUpperCase()})
    }
    if(objetRepere != '-1'){
      result.andWhere("Item.idOR = :objetRepere", {objetRepere : objetRepere})
    }
    if( dateDebut != '-1' && dateFin !='-1'){
      if(dateDebut == dateFin){
        result.andWhere(new Brackets(qb=>{
          qb.where("Item.dateCreation BETWEEN :start AND :end AND Item.dateModification is null", {start : dateDebut, end: date})
          qb.orWhere("Item.dateModification BETWEEN :start AND :end AND Item.dateModification is not null ", {start : dateDebut, end: date})
        }));
      
      }else{
        result.andWhere(new Brackets(qb=>{
          qb.where("Item.dateCreation BETWEEN :start AND :end AND Item.dateModification is null", {start : dateDebut, end: date})
          qb.orWhere("Item.dateModification BETWEEN :start AND :end AND Item.dateModification is not null", {start : dateDebut, end: date})
        }));
        
      }
    } else if(dateDebut != '-1'){
      result.andWhere(new Brackets(qb=>{
        qb.where("Item.dateCreation >= :startCrea AND Item.dateModification is null", {startCrea : dateDebut})
        qb.orWhere("Item.dateModification >= :startModif AND Item.dateModification is not null", {startModif : dateDebut})
      }));
      
    } else if(dateFin !='-1'){
      result.andWhere(new Brackets(qb=>{
        qb.where("Item.dateCreation <= :end AND Item.dateModification is null", { end: date})
        qb.orWhere("Item.dateModification <= :end AND Item.dateModification is not null", {end: date})
        
      })); 

    }
    if(etat != 'Aucun'){
      result.andWhere("Item.etat = :etat", {etat : etat});
    }

    if(estSecurite != '-1'){
      result.andWhere("Item.securite = :securite", {securite : estSecurite});
    }
    try {
      return await result.getRawMany();
    } catch (e){
      return {
        status : HttpStatus.CONFLICT,
        error :e,
      }
    }
  }


  /**
   *   
   * Créer des items sauvegardé au statut DAR ( demande admin refusée) pour permettre leur consultations après traitement 
   * @param listeItem Liste des objets repères à sauvegarder 
   * @param profil profil du créateur
   * @param date Date de création
   */


  async createItemForDemandeRefuse(listeItem : string[], profil : string, date : Date) {
    for (const item of listeItem) {
      let itemExist = await this.findOne(item);
      let createItemsaveDto :CreateItemsaveDto = {
        idItem: itemExist.idItem,
        libelleItem: itemExist.libelleItem,
        idOR: itemExist.idOR,
        numeroUnique: itemExist.numeroUnique,
        digit: itemExist.digit,
        codeObjet: itemExist.codeObjet,
        securite: itemExist.securite,
        etat: itemExist.etat,
        date: date,
        description: itemExist.description,
        status: 'DAR',
        profilModification: profil,
        posteModification: ''
      };      
      await this.itemSaveService.create(createItemsaveDto);
    }
  }


}



