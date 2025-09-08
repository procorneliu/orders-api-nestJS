import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcryptjs';
import { AuthPayloadDto } from './dto/auth-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: AuthPayloadDto) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) throw new NotFoundException('Incorrect email or password. Please try again');

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new UnauthorizedException('Incorrect email or password. Please try again');

    return {
      token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }
}
