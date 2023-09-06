import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtExceptionFilter } from './auth/filter/jwt.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new JwtExceptionFilter());
  await app.listen(9001);
}
bootstrap();
