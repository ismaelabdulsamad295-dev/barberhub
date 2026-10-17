import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProviderProfileDto } from './dto/create-provider-profile.dto';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

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
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Provider profile already exists');
      }
      throw e;
    }
  }

  // Finds the provider profile that belongs to the logged-in user
  private async getOwnProfileId(userId: string): Promise<string> {
    const profile = await this.prisma.providerProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Create a provider profile first');
    }
    return profile.id;
  }

  async createService(userId: string, dto: CreateServiceDto) {
    const providerId = await this.getOwnProfileId(userId);
    return this.prisma.service.create({
      data: { ...dto, providerId },
    });
  }

  async updateService(userId: string, serviceId: string, dto: UpdateServiceDto) {
    const providerId = await this.getOwnProfileId(userId);

    // The search includes providerId, so another provider's service is not found.
    // Returning 404 (not 403) avoids confirming that the service exists.
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, providerId },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return this.prisma.service.update({
      where: { id: serviceId },
      data: dto,
    });
  }
}
