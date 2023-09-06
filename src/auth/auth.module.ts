import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [PassportModule, JwtModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  exports: [PassportModule, LocalStrategy],
})
export class AuthModule {}
