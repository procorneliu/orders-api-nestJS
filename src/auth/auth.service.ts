import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcryptjs';
import { CreateUsersDto } from '../users/dtos/create-user.dto';
import { AuthDto } from './dtos/auth.dto';
import type { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async signUp(createUsersDto: CreateUsersDto, res: Response) {
    const userExists = await this.usersService.findUserByEmail(createUsersDto.email);
    if (userExists) throw new BadRequestException('User already exists');

    const newUser = await this.usersService.createUser(createUsersDto);

    const tokens = await this.getTokens(newUser.id, newUser.email, newUser.role);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

    res.cookie('accessToken', tokens.accessToken);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { refresh_token, ...userData } = newUser;

    return { userData, tokens };
  }

  async signIn(authDto: AuthDto, res: Response) {
    const user = await this.usersService.findUserByEmail(authDto.email);
    if (!user) throw new BadRequestException('Incorrect email or password.');

    const isPasswordCorrect = await bcrypt.compare(authDto.password, user.password);
    if (!isPasswordCorrect) throw new BadRequestException('Incorrect email or password');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    res.cookie('accessToken', tokens.accessToken);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refresh_token, ...userData } = user;

    return {
      userData,
      tokens,
    };
  }

  async logout(id: string, res: Response) {
    const user = await this.usersService.updateUser(id, { refresh_token: null });
    res.clearCookie('accessToken');

    return user;
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateUser(id, {
      refresh_token: hashedRefreshToken,
    });
  }

  async getTokens(id: string, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          email,
          role,
        },
        {
          secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
          expiresIn: '600s',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          email,
          role,
        },
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
          expiresIn: '1d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(email: string, refreshToken: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user || !refreshToken || !user.refresh_token) throw new ForbiddenException('Access denied!');

    const refreshTokenMath = await bcrypt.compare(refreshToken, user.refresh_token);
    if (!refreshTokenMath) throw new ForbiddenException('Access denied!');

    const tokens = await this.getTokens(user.id, email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }
}
