import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.setGlobalPrefix('api/v1');
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );
  await app.listen(4000);
}
bootstrap();
