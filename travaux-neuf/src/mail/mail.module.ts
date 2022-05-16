import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      //transport: 'smtps://itemisationlaita@gmail.com:item_laita29@Smtp.gmail.com:587',
      // or
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        // ignoreTLS: true,
        // secure: true,
        // tls: { rejectUnauthorized: false },
        auth: {
          user: 'itemisationlaita@gmail.com',
          pass: 'itemlaita29!',
        },
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
