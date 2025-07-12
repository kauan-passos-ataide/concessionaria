import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../common/interfaces/jwtPayload.interface';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';
import { RequestWithUser } from '../common/interfaces/requestWithUser.interface';
import { AuthService } from './auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    const refreshToken = request.cookies['refresh-token'] as string;
    if (!token || !refreshToken) {
      throw new UnauthorizedException();
    }
    try {
      const payloadAccessToken: JwtPayload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get<string>(
            'JWT_SECRET_ACCESS_TOKEN',
          ) as string,
        },
      );
      const payloadRefreshToken: JwtPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get<string>(
            'JWT_SECRET_REFRESH_TOKEN',
          ) as string,
        },
      );
      if (payloadAccessToken.id === payloadRefreshToken.id) {
        const request = context.switchToHttp().getRequest<RequestWithUser>();
        request.user = payloadAccessToken;
        return true;
      }
      return false;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
