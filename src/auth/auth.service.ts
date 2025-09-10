import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { AuthPayloadDto } from './dto/auth-payload.dto';
import { CreateUsersDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(createUsersDto: CreateUsersDto) {
    const userExists = await this.usersService.findUserByEmail(createUsersDto.email);
    if (userExists) throw new BadRequestException('User with this email already exists');

    const hashedPassword = await bcrypt.hash(createUsersDto.password, 12);

    const user = await this.usersService.createUser({ ...createUsersDto, password: hashedPassword });

    const tokens = await this.getTokens(user.email, user.role, user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async signIn(authPayloadDto: AuthPayloadDto, response: Response) {
    const user = await this.usersService.findUserByEmail(authPayloadDto.email);
    if (!user) throw new NotFoundException("User doesn't exist");

    const isPasswordCorrect = await bcrypt.compare(authPayloadDto.password, user.password);
    if (!isPasswordCorrect) throw new BadRequestException('Incorrect email or password. Please try again!');

    const tokens = await this.getTokens(user.email, user.role, user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });

    return tokens;
  }

  async logout(userId: string, response: Response) {
    response.clearCookie('accessToken');
    return this.usersService.updateUser(userId, { refresh_token: null });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findUser(userId);
    if (!user || !user.refresh_token) {
      throw new ForbiddenException('Access denied!');
    }

    const refreshTokenMath = await bcrypt.compare(refreshToken, user.refresh_token);
    if (!refreshTokenMath) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user.email, user.role, userId);
    await this.updateRefreshToken(userId, tokens.refreshToken);

    return tokens;
  }

  async validateUser({ email, password }: AuthPayloadDto) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) throw new NotFoundException('Incorrect email or password. Please try again');

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new UnauthorizedException('Incorrect email or password. Please try again');

    const { name, role } = user;

    return {
      token: this.jwtService.sign({ sub: user.id, user: { name, role } }),
    };
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 12);
    await this.usersService.updateUser(id, { refresh_token: hashedToken });
  }

  async getTokens(userEmail: string, userRole: string, id: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          userEmail,
          userRole,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '60s',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          userEmail,
          userRole,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '60m',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
