import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProviderProfileDto {
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  businessName: string;

  @IsIn(['BARBER', 'SALON', 'BOTH'])
  category: 'BARBER' | 'SALON' | 'BOTH';

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;
}
