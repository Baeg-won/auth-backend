import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 토큰을 찾을 위치
      ignoreExpiration: true, // 토큰 만료는 따로 처리
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'), // 토큰 생성시 사용했던 Secret 텍스트
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId, exp: payload.exp };
  }
}
