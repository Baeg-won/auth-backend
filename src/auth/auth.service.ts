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

    return await this.userRepository.save(new User(userId, hashedPassword));
  }

  async login(req: any): Promise<AuthResponseDto> {
    const userId = req.user.userId;

    // Access Token, Refresh Token 생성
    const accessToken = await this.generateToken(userId, 'ACCESS');
    const refreshToken = await this.generateToken(userId, 'REFRESH');

    // Refresh Token 저장
    await this.userRepository.update(
      { userId: userId },
      { refreshToken: refreshToken },
    );

    // 생성한 토큰 반환
    return new AuthResponseDto(accessToken, refreshToken);
  }

  async logout(req: any): Promise<HttpStatus> {
    const user = await this.userRepository.findByUserId(req.user.userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Refresh Token 삭제
    await this.userRepository.update(
      { userId: user.userId },
      { refreshToken: null },
    );

    return HttpStatus.OK;
  }

  async reissue(
    reissueRequestDto: ReissueRequestDto,
    req: any,
  ): Promise<{ accessToken: string }> {
    await this.validateRefreshToken(reissueRequestDto);

    // Access Token 만료 확인
    if (Date.now() <= req.user.exp * 1000) {
      return { accessToken: reissueRequestDto.accessToken };
    }

    // Access Token 재발급
    return { accessToken: await this.generateToken(req.user.userId, 'ACCESS') };
  }

  async generateToken(userId: string, tokenType: string): Promise<string> {
    const payload = { userId };

    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>(`JWT_${tokenType}_SECRET`), // 토큰을 만들 때 사용할 Secret 텍스트
      expiresIn: this.configService.get<number>(`JWT_${tokenType}_EXPIRATION_TIME`), // 토큰 유효 시간
    });
  }

  async validateRefreshToken(reissueRequestDto: ReissueRequestDto) {
    try {
      // Refresh Token 검증
      const verifiedRefreshToken = this.jwtService.verify(
        reissueRequestDto.refreshToken,
        { secret: this.configService.get<string>(`JWT_REFRESH_SECRET`) },
      );

      const user = await this.userRepository.findByUserId(
        verifiedRefreshToken.userId,
      );

      // Refresh Token 비교
      if (!user || reissueRequestDto.refreshToken != user.refreshToken) {
        return new UnauthorizedException('Invalid refresh-token');
      }
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh-token');
    }
  }
}
