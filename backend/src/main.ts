import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`APP RUNNING ON ${port}`);

  /*app.enableCors({
    origin: ['https://bielmeierbeck-8k7g.vercel.app'],

    credentials: true,
  });*/

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
