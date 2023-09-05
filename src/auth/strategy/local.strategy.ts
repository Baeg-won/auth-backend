import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../user/user.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      usernameField: 'userId',
      passwordField: 'userPassword',
    });
  }

  async validate(userId: string, userPassword: string) {
    const user = await this.userRepository.findByUserId(userId);

    if (!user || !(await bcrypt.compare(userPassword, user.userPassword))) {
      throw new UnauthorizedException('Invalid id or password');
    }

    return user;
  }
}
