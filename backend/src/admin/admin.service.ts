import { Injectable, NotFoundException } from '@nestjs/common';
import { VerificationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  listProviders() {
    return this.prisma.providerProfile.findMany({
      select: {
        id: true,
        businessName: true,
        category: true,
        verificationStatus: true,
        createdAt: true,
        user: { select: { email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async verifyProvider(adminId: string, providerId: string, status: 'APPROVED' | 'REJECTED') {
    const provider = await this.prisma.providerProfile.findUnique({ where: { id: providerId } });
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const updated = await this.prisma.providerProfile.update({
      where: { id: providerId },
      data: {
        verificationStatus:
          status === 'APPROVED' ? VerificationStatus.APPROVED : VerificationStatus.REJECTED,
      },
    });

    // Every admin decision is recorded with who made it and when
    await this.prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: `PROVIDER_${status}`,
        entityType: 'ProviderProfile',
        entityId: providerId,
      },
    });

    return { id: updated.id, verificationStatus: updated.verificationStatus };
  }
}
