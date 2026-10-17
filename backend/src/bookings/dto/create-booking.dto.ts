import { IsISO8601, IsString, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  serviceId: string;

  // Start time in ISO format, for example 2026-12-01T10:00:00Z
  @IsISO8601()
  startsAt: string;
}
