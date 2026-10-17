import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Only the BarberHub frontend may call this API from the browser
  app.enableCors({ origin: 'http://localhost:3001' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(3000);
  console.log('API running on http://localhost:3000');
}
bootstrap();
