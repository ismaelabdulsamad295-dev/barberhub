import { IsIn } from 'class-validator';

export class VerifyProviderDto {
  @IsIn(['APPROVED', 'REJECTED'])
  status: 'APPROVED' | 'REJECTED';
}
