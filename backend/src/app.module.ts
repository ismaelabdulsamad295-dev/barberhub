import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [PrismaModule, AuthModule, ProvidersModule],
  controllers: [AppController],
})
export class AppModule {}
