import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ParametreService } from 'src/parametre/parametre.service';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private utilisateurService : UtilisateurService, private parametreService : ParametreService) {}

  async sendUserConfirmation(profil: string, motif : string) {

    let emailAdmin = (await this.parametreService.findOne("email")).valeur;
    let infoUser = await this.utilisateurService.findOneByLogin(profil)
    let user: string;
    if(infoUser != undefined){
      user = infoUser.nom.toUpperCase() +" "+ infoUser.prenom; 
    }else {
      user = profil;
    }
    try {
      
        await this.mailerService.sendMail({
        to: emailAdmin,
        from: '"Logiciel Itemisation" <itemisationlaita@laita.fr>', // override default from
        subject: '[Itemisation] Demande de suppression',
        template: 'confirmation',
        context: { 
            name: user,
            motif: motif,
        },
        });
      } catch (e :any){
        console.log(e);
        
      } 
  }

  async sendUserConfirmationDelete(user : string, motif : string) {
    let email = await this.utilisateurService.findEmailByLogin(user);
   
    try {
      await this.mailerService.sendMail({
      to: email.email,
      from: '"Logiciel Itemisation" <itemisationlaita@laita.fr>',
      subject: '[Itemisation] Suppression acceptée',
      template: 'confirmDelete',  
      context: {
        motif: motif  
      },
      });
    } catch (e :any){
      console.log(e);
    } 
  }

}
