import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request);

    if (!accessToken) {
      throw new UnauthorizedException('Access-token not found');
    }

    try {
      request.user = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        ignoreExpiration: true, // 토큰 만료는 따로 처리
      });
    } catch {
      throw new UnauthorizedException('Invalid access-token');
    }

    if (!request.user) {
      throw new UnauthorizedException('User not found');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
