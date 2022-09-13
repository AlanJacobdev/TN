import { Injectable,  } from '@nestjs/common';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { JwtService } from '@nestjs/jwt';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import * as randomToken from 'rand-token';
import * as moment from 'moment';

/**
 * @author : @alanjacobdev
 * Classe appellée par un controleur. 
 * Manipule des données afin de les renvoyer au controleur après traitement
 */

@Injectable()
export class AuthService {
 
  constructor(private utilisateurService : UtilisateurService, private jwtService: JwtService){}

  /**
   * Fonction utilisé par la strategy Local, permettant de connaitre si un utilisateur existe ou non
   * @param login : login de l'utilisateur
   * @param password : password de l'utilisateur
   * @returns : Des informations sur l'utilisateur ou null en cas d'utilisateur inconnu
   */
  async validateUser (login : string , password : string) {
    const user = await this.utilisateurService.findOneConnexion(login,password);
    
    if (user != undefined) {
      if ( user.hasOwnProperty('error')){
        const resAny : any = user;
        return resAny;
      } else if (user instanceof Utilisateur){
        const { password,profilCreation, posteCreation, dateCreation, profilModification, posteModification , dateModification, ...result}= user
        return result
      } 
    }
    return null;
  }


  /**
   * Retourne un token JWT utile à l'application, transportant des informations
   * @param user : informations retouner par la fonction validateUser ci-dessus
   * @returns : Token avec les informations stockés au sein de la variables payload
   */
  async login(user: any) {
    if ( user.hasOwnProperty('error')){
        const resAny : any = user;
        return resAny;
    }
    const payload = { idUtilisateur: user.idUtilisateur, nom: user.nom, prenom: user.prenom, login : user.login, idService : user.idService, estAdministrateur: user.estAdministrateur };
    return {
      access_token: this.jwtService.sign(payload), 
    };
  }


   
  public async getRefreshToken(userId: number): Promise<string> {
      const update = {
        refreshToken: randomToken.generate(16),
        refreshTokenExp: moment().add(1, 'days').format('YYYY/MM/DD'),
      };

      console.log(update);
      
      await this.utilisateurService.updateToken(userId, update);
      return update.refreshToken;
  }



  public async validRefreshToken(login: any, refreshToken: any) {
   const currentDate = moment().format('YYYY/MM/DD');
   console.log(currentDate);
   
   let user = await this.utilisateurService.findOneForToken(login, refreshToken, currentDate)
   
   if (!user) {
    return null;
   }
   return user;
  }


  

}
