import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateProviderProfileDto } from './dto/create-provider-profile.dto';
import { ProvidersService } from './providers.service';

@Controller('providers')
export class ProvidersController {
  constructor(private providersService: ProvidersService) {}

  @Post('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER')
  createProfile(@Request() req, @Body() dto: CreateProviderProfileDto) {
    // The user ID comes from the verified token, never from the request body
    return this.providersService.createProfile(req.user.sub, dto);
  }
}
