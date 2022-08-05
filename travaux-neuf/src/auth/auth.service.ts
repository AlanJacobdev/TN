import { Injectable } from '@nestjs/common';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { JwtService } from '@nestjs/jwt';
import { NOMEM } from 'dns';

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
      const { password,profilCreation, posteCreation, dateCreation, profilModification, posteModification , dateModification, ...result}= user
      return result
    }
    return null;
  }


  /**
   * Retourne un token JWT utile à l'application, transportant des informations
   * @param user : informations retouner par la fonction validateUser ci-dessus
   * @returns : Token avec les informations stockés au sein de la variables payload
   */
  async login(user: any) {
    const payload = { idUtilisateur: user.idUtilisateur, nom: user.nom, prenom: user.prenom, login : user.login, idService : user.idService, estAdministrateur: user.estAdministrateur };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }


  

}
