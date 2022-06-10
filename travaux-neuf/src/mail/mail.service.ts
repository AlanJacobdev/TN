import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(profil: string, motif : string) {

    try {
      
        await this.mailerService.sendMail({
        to: 'alan.jacob@laita.fr',
        from: '"Logiciel Itemisation" <itemisationlaita@laita.fr>', // override default from
        subject: '[Itemisation] Demande de suppression',
        template: 'confirmation', // `.hbs` extension is appended automatically
        context: { // ✏️ filling curly brackets with content
            name: profil,
            motif: motif,
        },
        });
      } catch (e :any){
        console.log(e);
        
      } 
  }
}
