import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRequestDto } from './dto/auth-request.dto';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../user/user.repository';
import User from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ReissueRequestDto } from './dto/reissue-request.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(authRequestDto: AuthRequestDto): Promise<User> {
    const { userId, userPassword } = authRequestDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    const user = new User();
    user.userId = userId;
    user.userPassword = hashedPassword;

    await this.userRepository.save(user);

    return user;
  }

  async login(authRequestDto: AuthRequestDto): Promise<AuthResponseDto> {
    const { userId, userPassword } = authRequestDto;

    const user = await this.userRepository.findByUserId(userId);

    if (!user || !(await bcrypt.compare(userPassword, user.userPassword))) {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    // Access Token, Refresh Token 생성
    const accessToken = await this.generateAccessToken(userId);
    const refreshToken = await this.generateRefreshToken(userId);

    // Refresh Token 저장
    await this.userRepository.update(
      { userId: userId },
      { refreshToken: refreshToken },
    );

    const res = new AuthResponseDto();
    res.accessToken = accessToken;
    res.refreshToken = refreshToken;

    return res;
  }

  async logout(req: any) {
    const user = await this.userRepository.findByUserId(req.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    // Refresh Token 삭제
    await this.userRepository.update(
      { userId: req.user.userId },
      { refreshToken: null },
    );

    return HttpStatus.OK;
  }

  async reissue(reissueRequestDto: ReissueRequestDto, req: any) {
    const user = await this.userRepository.findByUserId(req.userId);

    if (!user || reissueRequestDto.refreshToken != user.refreshToken) {
      throw new UnauthorizedException();
    }

    // Access Token 만료 확인
    if (Date.now() <= req.user.exp * 1000) {
      return { accessToken: reissueRequestDto.accessToken };
    }

    // Access Token 재발급
    return { accessToken: await this.generateAccessToken(req.user.userId) };
  }

  async generateAccessToken(userId: string): Promise<string> {
    const payload = { userId };

    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'), // 토큰을 만들 때 사용할 Secret 텍스트
      expiresIn: this.configService.get<number>('JWT_ACCESS_EXPIRATION_TIME'), // 토큰 유효 시간
    });
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const payload = { userId };

    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<number>('JWT_REFRESH_EXPIRATION_TIME'),
    });
  }
}
