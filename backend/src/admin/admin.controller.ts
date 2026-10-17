import { Body, Controller, Get, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminService } from './admin.service';
import { VerifyProviderDto } from './dto/verify-provider.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('providers')
  listProviders() {
    return this.adminService.listProviders();
  }

  @Patch('providers/:id/verify')
  verifyProvider(@Request() req, @Param('id') id: string, @Body() dto: VerifyProviderDto) {
    return this.adminService.verifyProvider(req.user.sub, id, dto.status);
  }
}
