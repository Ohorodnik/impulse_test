import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as express from 'express';
import { jwtPayloadSchema } from 'src/auth/dto/jwt-payload.dto';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<express.Request>();
    const token = this.extractToken(req);
    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }
    try {
      const payload = await this.authService.verifyJwt(token);
      const jwtPayload = jwtPayloadSchema.parse(payload);
      req.user = jwtPayload;
    } catch {
      throw new UnauthorizedException('Invalid authorization token');
    }

    return true;
  }

  private extractToken(req: express.Request): string | null {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' && token ? token : null;
  }
}
