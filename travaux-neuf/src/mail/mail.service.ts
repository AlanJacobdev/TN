import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private utilisateurService : UtilisateurService) {}

  async sendUserConfirmation(profil: string, motif : string) {

    let infoUser = await this.utilisateurService.findOneByLogin(profil)
    let user;
    if(infoUser != undefined){
      user = infoUser.nom.toUpperCase(); 
    }else {
      user = profil;
    }
    try {
      
        await this.mailerService.sendMail({
        to: 'alan.jacob@laita.fr',
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

  async sendUserConfirmationDelete(motif : string) {

    try {
      
        await this.mailerService.sendMail({
        to: 'alan.jacob@laita.fr',
        from: '"Logiciel Itemisation" <itemisationlaita@laita.fr>', // override default from
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
