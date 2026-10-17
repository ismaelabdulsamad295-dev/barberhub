import { IsInt, Matches, Max, Min } from 'class-validator';

export class CreateAvailabilityDto {
  // 0 = Sunday, 6 = Saturday
  @IsInt()
  @Min(0)
  @Max(6)
  weekday: number;

  // Times in 24-hour HH:MM format
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'startTime must be HH:MM' })
  startTime: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'endTime must be HH:MM' })
  endTime: string;
}
