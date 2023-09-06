import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: any): Promise<AuthResponseDto> {
    return await this.authService.login(req);
  }

  @Post('/auth/logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req: any): Promise<HttpStatus> {
    return await this.authService.logout(req);
  }

  @Post('/token/reissue')
  @UseGuards(AuthGuard('jwt'))
  async reissue(
    @Body() reissueRequestDto: ReissueRequestDto,
    @Req() req: any,
  ): Promise<{ accessToken: string }> {
    return await this.authService.reissue(reissueRequestDto, req);
  }
}
