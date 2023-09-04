import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequestDto } from './dto/auth-request.dto';
import User from '../user/user.entity';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ReissueRequestDto } from './dto/reissue-request.dto';

@Controller('/api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/auth/register')
  async register(@Body() authRequestDto: AuthRequestDto): Promise<User> {
    return await this.authService.register(authRequestDto);
  }

  @Post('/auth/login')
  async login(@Body() authRequestDto: AuthRequestDto): Promise<AuthResponseDto> {
    return await this.authService.login(authRequestDto);
  }

  @Post('/auth/logout')
  async logout(@Body() logoutRequest: { accessToken: string }) {
    return await this.authService.logout(logoutRequest);
  }

  @Post('/token/reissue')
  async reissue(@Body() reissueRequestDto: ReissueRequestDto) {
    return await this.authService.reissue(reissueRequestDto);
  }
}
