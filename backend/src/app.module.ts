import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [PrismaModule, AuthModule, ProvidersModule, BookingsModule, AdminModule],
  controllers: [AppController],
})
export class AppModule {}
