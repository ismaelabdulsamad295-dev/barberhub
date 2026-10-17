import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Any logged-in user with a valid token
  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER', 'PROVIDER', 'ADMIN')
  me(@Request() req) {
    return req.user;
  }

  // Only admins
  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  adminOnly() {
    return { message: 'Welcome, admin' };
  }
}
