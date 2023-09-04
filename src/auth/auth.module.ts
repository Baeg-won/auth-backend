import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { JwtAccessStrategy } from './jwt-access.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // Passport 기본 전략 설정
    JwtModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
  exports: [PassportModule, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
