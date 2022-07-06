import { Injectable } from '@nestjs/common';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';
import { JwtService } from '@nestjs/jwt';
import { NOMEM } from 'dns';

@Injectable()
export class AuthService {

  constructor(private utilisateurService : UtilisateurService, private jwtService: JwtService){}

  async validateUser (login : string , password : string) {
    const user = await this.utilisateurService.findOneConnexion(login,password);
    if (user != undefined) {
      const { password,profilCreation, posteCreation, dateCreation, profilModification, posteModification : string , dateModification, ...result}= user
      return result
    }
    return null;
  }

  async login(user: any) {
    const payload = { idUtilisateur: user.idUtilisateur, nom: user.nom, prenom: user.prenom, login : user.login, idService : user.idService, estAdministrateur: user.estAdministrateur };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }


  

}
