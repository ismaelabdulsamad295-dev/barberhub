import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  // Public list: approved providers only, with their active services.
  // The select lists exactly the fields that are safe to show anyone.
  listProviders() {
    return this.prisma.providerProfile.findMany({
      where: { verificationStatus: 'APPROVED' },
      select: {
        id: true,
        businessName: true,
        category: true,
        bio: true,
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            description: true,
            durationMin: true,
            priceCents: true,
            targetAudience: true,
          },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { businessName: 'asc' },
    });
  }

  // A pending or rejected provider looks like it doesn't exist, so it returns 404
  async getProvider(providerId: string) {
    const provider = await this.prisma.providerProfile.findFirst({
      where: { id: providerId, verificationStatus: 'APPROVED' },
      select: {
        id: true,
        businessName: true,
        category: true,
        bio: true,
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            description: true,
            durationMin: true,
            priceCents: true,
            targetAudience: true,
          },
          orderBy: { name: 'asc' },
        },
      },
    });
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }
    return provider;
  }
}
