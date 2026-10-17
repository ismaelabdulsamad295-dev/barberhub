import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header: string | undefined = request.headers['authorization'];

    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      // verifyAsync checks the signature and the expiry time
      request.user = await this.jwt.verifyAsync(header.slice(7));
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
