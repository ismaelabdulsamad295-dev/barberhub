import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProviderProfileDto } from './dto/create-provider-profile.dto';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  async createProfile(userId: string, dto: CreateProviderProfileDto) {
    try {
      return await this.prisma.providerProfile.create({
        data: {
          userId,
          businessName: dto.businessName,
          category: dto.category,
          bio: dto.bio,
        },
      });
    } catch (e) {
      // userId is unique, so a second profile for the same user fails with P2002
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Provider profile already exists');
      }
      throw e;
    }
  }
}
