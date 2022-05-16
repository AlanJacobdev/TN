import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(profil: string, token: string) {
    const url = `test/test.fr`;

    try {
      
        await this.mailerService.sendMail({
        to: 'lappere@laita.fr',
        from: '"Logiciel Itemisation" <itemisationlaita@gmail.com>', // override default from
        subject: 'Ceci est un test d\'envoi par logiciel',
        template: 'confirmation', // `.hbs` extension is appended automatically
        context: { // ✏️ filling curly brackets with content
            name: profil,
            url,
        },
        });
      } catch (e :any){
        console.log(e);
        
      } 
  }
}
