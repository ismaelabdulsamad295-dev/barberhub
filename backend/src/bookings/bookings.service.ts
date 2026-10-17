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

    // Times are compared in UTC for this project
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

  // Lists only the logged-in customer's bookings. The WHERE clause uses the token's user ID.
  async listMine(customerId: string) {
    return this.prisma.$queryRaw`
      SELECT id, status, price_cents_snapshot AS "priceCents",
             lower(time_range) AS "startsAt", upper(time_range) AS "endsAt"
      FROM appointments
      WHERE customer_id = ${customerId}::uuid
      ORDER BY lower(time_range) DESC`;
  }

  async cancel(customerId: string, appointmentId: string) {
    // The search includes customerId, so another customer's booking looks like it doesn't exist
    const appt = await this.prisma.appointment.findFirst({
      where: { id: appointmentId, customerId },
    });
    if (!appt) {
      throw new NotFoundException('Booking not found');
    }
    if (appt.status === 'CANCELLED') {
      return { id: appt.id, status: 'CANCELLED' };
    }
    const updated = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CANCELLED' },
    });
    return { id: updated.id, status: updated.status };
  }
}
