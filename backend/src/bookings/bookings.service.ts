import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(customerId: string, dto: CreateBookingDto) {
    const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
    if (!service || !service.isActive) {
      throw new NotFoundException('Service not found');
    }

    const start = new Date(dto.startsAt);
    if (start.getTime() < Date.now()) {
      throw new BadRequestException('Cannot book in the past');
    }
    const end = new Date(start.getTime() + service.durationMin * 60000);

    // Check the provider's weekly hours. Times are compared in UTC for this project.
    const hhmm = (d: Date) =>
      `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;

    const rule = await this.prisma.availabilityRule.findFirst({
      where: {
        providerId: service.providerId,
        weekday: start.getUTCDay(),
        startTime: { lte: hhmm(start) },
        endTime: { gte: hhmm(end) },
      },
    });
    if (!rule) {
      throw new BadRequestException('Outside the provider working hours');
    }

    try {
      // The time range is written with raw SQL because Prisma cannot write tstzrange.
      // If another active booking overlaps, PostgreSQL rejects the row (error 23P01).
      await this.prisma.$executeRaw`
        INSERT INTO appointments
          (id, customer_id, provider_id, service_id, time_range, status, price_cents_snapshot, updated_at)
        VALUES
          (gen_random_uuid(),
           ${customerId}::uuid,
           ${service.providerId}::uuid,
           ${service.id}::uuid,
           tstzrange(${start}::timestamptz, ${end}::timestamptz, '[)'),
           'CONFIRMED'::"AppointmentStatus",
           ${service.priceCents},
           now())`;
    } catch (e: any) {
      const code = String(e?.meta?.code ?? '');
      const msg = String(e?.message ?? '');
      if (code === '23P01' || msg.includes('no_overlapping_bookings')) {
        throw new ConflictException('Slot already booked');
      }
      throw e;
    }

    return {
      message: 'Booked',
      providerId: service.providerId,
      startsAt: start,
      endsAt: end,
    };
  }
}
