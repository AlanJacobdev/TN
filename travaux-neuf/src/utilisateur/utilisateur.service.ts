import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { Utilisateur } from './entities/utilisateur.entity';
import * as bcrypt from 'bcrypt';
import { emailUser, userIdentity } from './dto/user';
import { RoleService } from 'src/role/role.service';
import * as moment from 'moment';

/**
 * @author : @alanjacobdev
 * Classe appellée par un controleur. 
 * Manipule des données afin de les renvoyer au controleur après traitement
 */

@Injectable()
export class UtilisateurService {
  constructor(@InjectRepository(Utilisateur) private utiRepo: Repository<Utilisateur>, private roleService : RoleService){}
  
  /**
   * Creation d'un utilisateur
   * @param createUtilisateurDto : Informations utiles à la création
   * @returns Structure du nouvel utilisateur ou erreur
   */
  async create(createUtilisateurDto: CreateUtilisateurDto) {
    let loginExist = await this.findOneByLogin(createUtilisateurDto.login);
    if (loginExist == undefined){
      let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
      let isEmail = regex.test(createUtilisateurDto.email);
      if (isEmail) {
        const saltOrRounds = await bcrypt.genSalt();   
          const uti = await this.findOne(createUtilisateurDto.idUtilisateur);
          if (uti == undefined){
            createUtilisateurDto.dateCreation = new Date();
            createUtilisateurDto.password =  await bcrypt.hash(createUtilisateurDto.password, saltOrRounds)

            const newUti = this.utiRepo.create(createUtilisateurDto);
            const u = await this.utiRepo.save(newUti);
            delete u.password;
            return u;
          } else {
            return {
              status : HttpStatus.CONFLICT,
              error :'Already exist',
            }
          }
      } else {
        return  {
          status : HttpStatus.NOT_ACCEPTABLE,
          error :'Format d\'adresse mail incorrect (attendu = user@test.fr ou user.test@test.fr) '
        }
      }
    } else {
      return  {
        status : HttpStatus.NOT_ACCEPTABLE,
        error :'Le login est déjà lié à un utilisateur'
      }
    }
  }

  /**
   * Retourne l'ensemble des utilisateurs
   * @returns Liste des utilisateurs existant
   */
  async findAll() {
    let res = await this.utiRepo.find({
      order: {
        login : "ASC"
      }
    });
    for (const u of res){
      delete u.password
    }
    return res
  }

  /**
   * Retourne un utilisateur
   * @param id : Identifiant d'un utilisateur
   * @returns Structure de l'utilisateur recherché ou erreur
   */
  async findOne(id: number) {
    return this.utiRepo.findOne({
      where : {
        idUtilisateur : id
      }
    })
  }

  /**
   * Recherche le status administrateur d'un utilisateur donné
   * @param id : Identifiant d'un utilisateur
   * @returns True or false
   */
  estAdmin(id: number) {
    return this.utiRepo.findOne({
      select : ["estAdministrateur"],
      where : {
        idUtilisateur : id
      }
    })
  }
  
  /**
   * Recherche un utilisateur en fonction des ses token et son login
   * @param login : Identifiant (login) de l'utilisateur
   * @param refreshToken : Jeton de rafraichissement
   * @param refreshTokenExp : Expiration du jeton de rafraichissement
   * @returns Structure de l'utilisateur ou undefined
   */
  findOneForToken( login : string, refreshToken : string, refreshTokenExp : string) {
    let dateMoment  = moment(refreshTokenExp, 'YYYY/MM/DD');
    let newDateMoment = dateMoment.add(1, 'days').format('YYYY/MM/DD')
    return this.utiRepo.findOne({
      where : {
        login : login,
        refreshToken : refreshToken,
        refreshTokenExp : newDateMoment
      }
    })
  }

  /**
   * Recupère les ateliers accessibles pour un utilisateur
   * @param user : Identifiant d'un utilisateur
   * @returns : Liste des ateliers accessibles par l'utilisateur
   */
  async getAtelierFromUser(user :string){
    let role = await this.utiRepo.findOne({
      select:['idRole'],
      where : {
        login : user
      }
    })
    return await this.roleService.getAtelierFromRole(role.idRole);

  }

  /**
   * Retourne la liste des type d'objet repères accessibles pour un utilisateur
   * @param user : identifiant de l'utilisateur 
   * @returns Liste des types d'objet repère accessibles par un utilisateur 
   */
  async getTypeORFromUser(user :string){
    let role = await this.utiRepo.findOne({
      select:['idRole'],
      where : {
        login : user
      }
    })
    return await this.roleService.getTypeORFromRole(role.idRole);

  }

  /**
   * Retourne le nom et prénom d'un utilisateur
   * @param loginUser : Login de l'utilisateur
   * @returns Nom et prénom de l'utilisateur
   */
  async findOneByLogin(loginUser :string) : Promise<userIdentity>{
    return this.utiRepo.findOne({
      select : ['nom','prenom'],
      where : {
        login : loginUser
      }
    })
  }

  /**
   * Retourne l'email d'un utilisateur
   * @param loginUser : Login d'un utilisateur
   * @returns 
   */
  async findEmailByLogin(loginUser : string) : Promise<emailUser>{
    return this.utiRepo.findOne({
      select : ['email'],
      where : {
        login : loginUser
      }
    })
  }

  /**
   * Vérifie la concordance des mot de passe et l'existence du login
   * @param login : Login de l'utilisateur
   * @param password : Mot de passe de l'utilisateur
   * @returns Structure de l'utilisateur ou undefined (erreur)
   */
  async findOneConnexion(login: string, password : string) {
    const user = await this.utiRepo.findOne({
      where : {
        login : login,
      }
    })
    if (user.estActif == false){
      return {
        status : HttpStatus.I_AM_A_TEAPOT,
        error : 'Votre compte a été désactivé.'
      }
    }
    
    if (user != undefined) {    
      const match = await bcrypt.compare(password, user.password)
      if (match) {
        delete user.password;
        return user;
      } else {
        return undefined
      }
    } else {
      return undefined;
    }
  }

  /**
   * Modification d'un utilisateur
   * @param id : identifiant de l'utilisateur
   * @param updateUtilisateurDto : Informations a modifier
   * @returns Structure de l'utilisateur modifiée ou erreur
   */
  async update(id: number, updateUtilisateurDto: UpdateUtilisateurDto) {
    let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
    let isEmail = regex.test(updateUtilisateurDto.email);
    if (isEmail) {
      const uti = await this.utiRepo.findOne({
        where : {
          idUtilisateur : id
        }
      })
      if (uti == undefined) {
        return {
          status : HttpStatus.NOT_FOUND,
          error : 'Identifier not found'
        }
      }
      
      if(uti.nom == updateUtilisateurDto.nom 
        && uti.prenom == updateUtilisateurDto.prenom 
        && uti.email == updateUtilisateurDto.email 
        && uti.idRole == updateUtilisateurDto.idRole
        && uti.estAdministrateur == updateUtilisateurDto.estAdministrateur){
          return {
            status : HttpStatus.CONFLICT,
            error :'Aucune modification apportées',
          }
      }

      updateUtilisateurDto.dateModification = new Date();
      await this.utiRepo.update(id, updateUtilisateurDto);
      let user =  await this.utiRepo.findOne(id);
      delete user.password;
      return user;
    } else {
      return  {
        status : HttpStatus.NOT_ACCEPTABLE,
        error :'Format d\'adresse mail incorrect'
      }
    }
  }

  /**
   * Modifie le mot de passe de l'utilisateur
   * @param idUser : Identifiant de l'utilisateur
   * @param updateUtilisateurDto : Informations a modifier
   * @returns Structure de l'utilisateur(valide) ou erreur(echec)
   */
  async updatePwd(idUser: number, updateUtilisateurDto: UpdateUtilisateurDto) {
    const uti = await this.utiRepo.findOne({
      where : {
        idUtilisateur : idUser
      }
    })
    if (uti == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier not found'
      }
    }

    const saltOrRounds = await bcrypt.genSalt(); 
    updateUtilisateurDto.password = await bcrypt.hash(updateUtilisateurDto.password, saltOrRounds)
    updateUtilisateurDto.dateModification = new Date();
    await this.utiRepo.update(idUser, updateUtilisateurDto);
    let user =  await this.utiRepo.findOne(idUser);
    delete user.password;
    return user;
  }

  /**
   * Modifie l'état de l'utilisateur (actif / inactif)
   * @param idUser : identifiant de l'utilisateur
   * @param updateUtilisateurDto : Informations a modifier
   * @returns 
   */
  async updateActif(idUser: number, updateUtilisateurDto: UpdateUtilisateurDto) {
    const uti = await this.utiRepo.findOne({
      where : {
        idUtilisateur : idUser
      }
    })
    if (uti == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier not found'
      }
    }

    await this.utiRepo.update(idUser, updateUtilisateurDto);
    let user =  await this.utiRepo.findOne(idUser);
    delete user.password;
    return user;
  }

  /**
   * Mise à jour du jeton
   * @param idUser : Identifiant de l'utilisateur
   * @param updateUtilisateurDto : Informations à modifier
   * @returns Structure de l'utilisateur (valdie) ou erreur (echec)
   */
  async updateToken(idUser: number, updateUtilisateurDto: any) {
    const uti = await this.utiRepo.findOne({
      where : {
        idUtilisateur : idUser
      }
    })
    if (uti == undefined) {
      return {
        status : HttpStatus.NOT_FOUND,
        error : 'Identifier not found'
      }
    }

    await this.utiRepo.update(idUser, updateUtilisateurDto);
    let user =  await this.utiRepo.findOne(idUser);
    delete user.password;
    return user;
  }

  /**
   * Suppression d'un utilisateur
   * @param id : Identifiant de l'utilisateur 
   * @returns Message de validation ou erreur
   */
  async remove(id: number) {
    const uti = await this.utiRepo.findOne({
      where : {
        idUtilisateur : id
      }
    })
    if (uti == undefined) {
      throw new HttpException({
        status : HttpStatus.NOT_FOUND,
        error : 'Utilisateur non trouvé',
      }, HttpStatus.NOT_FOUND)
    }
    try {
      await this.utiRepo.delete(id);
    } catch ( e : any) {
      return {
        status : HttpStatus.CONFLICT,
        error :'Impossible de supprimer l\'utilisateur',
      }
    }
    return {
      status : HttpStatus.OK,
      message :'Deleted',
    }
  }

  /**
   * NON UTILISEE
   * @param login 
   * @param pwd 
   */
  async findUserOnCimaint (login: string, pwd:string) {

    // try {
    //   const co = await odbc.connect('DSN=EVNADMIN;Uid=XTC02SPA;Password=xtc02002');
    //   const res = await co.query('SELECT NOMUTILI, PRENOMUT FROM GEN99.GWUTI WHERE LOGINUTI = ? AND PASSWORD = ?', [login, pwd]);
    //   if (res.count == 0) {
    //     return undefined;
    //   }
 
    //   return res;
    // } catch ( e :any) {
    //   console.log(e);
    // }
    
  }

  /**
   * NON UTILISEE
   * @param req 
   * @param id 
   * @param pwd 
   */
   async userExistOrNot(req : any, id : string, pwd : string) {

    
    // const ActiveDirectory = require('activedirectory');
    // var config = new ActiveDirectory({
    //   url: 'ldap://GREDC01.even.fr:389',
    //   baseDN: 'DC=even,DC=fr',
    //   username: 'env.NAME',
    //   password: 'env.PWD'
    // })
    
    // const ad = config;
    // ad.authenticate(id, pwd, function(err, auth) {
    //   if (err) {
    //     console.log('Authentication failed!');
    //     return;
    //   }
    //   if (auth) {
    //     console.log(id + ' Authenticated!');
    //   }
    //   else {
    //     console.log('Authentication failed!');
    //   }
    // });

    
   }

}
