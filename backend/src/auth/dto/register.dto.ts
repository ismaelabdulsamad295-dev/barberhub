import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(12)
  @MaxLength(128)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName: string;

  // Only customers and providers can register themselves. ADMIN is never accepted.
  @IsOptional()
  @IsIn(['CUSTOMER', 'PROVIDER'])
  role?: 'CUSTOMER' | 'PROVIDER';
}
