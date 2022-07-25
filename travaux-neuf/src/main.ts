import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn'],
  });
  app.enableCors({
    "origin": true
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  app.use(
    session({
      secret: 'my-secret',
      resave: true,
      saveUninitialized: true,
    }),
  );


  await app.listen(3000);
}
bootstrap();
