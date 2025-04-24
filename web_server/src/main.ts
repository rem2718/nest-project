import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
  const config = new DocumentBuilder()
    .setTitle('Nest Project API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             
      forbidNonWhitelisted: true,  
      transform: true,            
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
