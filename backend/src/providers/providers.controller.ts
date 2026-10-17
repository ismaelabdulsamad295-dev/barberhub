import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateAvailabilityDto } from './dto/availability.dto';
import { CreateProviderProfileDto } from './dto/create-provider-profile.dto';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { ProvidersService } from './providers.service';

@Controller('providers')
export class ProvidersController {
  constructor(private providersService: ProvidersService) {}

  @Post('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER')
  createProfile(@Request() req, @Body() dto: CreateProviderProfileDto) {
    return this.providersService.createProfile(req.user.sub, dto);
  }

  @Post('services')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER')
  createService(@Request() req, @Body() dto: CreateServiceDto) {
    return this.providersService.createService(req.user.sub, dto);
  }

  @Patch('services/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER')
  updateService(@Request() req, @Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.providersService.updateService(req.user.sub, id, dto);
  }

  @Post('availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER')
  createAvailability(@Request() req, @Body() dto: CreateAvailabilityDto) {
    return this.providersService.createAvailability(req.user.sub, dto);
  }

  @Get('availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER')
  listAvailability(@Request() req) {
    return this.providersService.listAvailability(req.user.sub);
  }
}
