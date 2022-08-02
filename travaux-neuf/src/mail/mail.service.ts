import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ParametreService } from 'src/parametre/parametre.service';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';


/**
 * @author : @alanjacobdev
 * Les templates se situes dans le repertoire /templates
 */


@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private utilisateurService : UtilisateurService, private parametreService : ParametreService) {}

  /**
   * Envoie un mail à l'email administrateur pour notifier d'une nouvelle demande de suppression
   * @param profil : profil du demandeur
   * @param motif : Motif de la demande
   */
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

  /**
   * Envoie une confirmation de suprresion d'une demande à un utilisateur 
   * @param user : Utilisateur ayant fait la demande 
   * @param motif : Motif de la demande d'origine
   */
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
