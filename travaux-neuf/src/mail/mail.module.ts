import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { UtilisateurModule } from 'src/utilisateur/utilisateur.module';
import { ParametreModule } from 'src/parametre/parametre.module';

@Module({
  imports: [ParametreModule,
    UtilisateurModule,
    MailerModule.forRoot({
      //transport: 'smtps://itemisationlaita@gmail.com:item_laita29@Smtp.gmail.com:587',
      // or
      transport: {
        host: 'postel.even.fr',
        port: 25,
        // // ignoreTLS: true,
        // // secure: true,
        // // tls: { rejectUnauthorized: false },
        // auth: {
        //   user: 'itemisationlaita@gmail.com',
        //   pass: 'itemlaita29!',
        // },
      },
      defaults: {
        from: '"No Reply" <itemisationlaita@gmail.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), 
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], 
})
export class MailModule {}
