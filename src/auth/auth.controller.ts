import { Body, Controller, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequestDto } from './dto/auth-request.dto';
import User from '../user/user.entity';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ReissueRequestDto } from './dto/reissue-request.dto';
import { AuthGuard } from '@nestjs/passport';

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
  @UseGuards(AuthGuard('access'))
  async logout(@Body() logoutRequest: { accessToken: string }, @Req() req: any) {
    return await this.authService.logout(req);
  }

  @Post('/token/reissue')
  @UseGuards(AuthGuard('refresh'), AuthGuard('access'))
  async reissue(@Body() reissueRequestDto: ReissueRequestDto, @Req() req: any) {
    return await this.authService.reissue(reissueRequestDto, req);
  }
}
