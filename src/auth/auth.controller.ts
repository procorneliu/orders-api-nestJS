import { Controller, Post, Get, Body, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { CreateUsersDto } from 'src/users/dtos/create-user.dto';
import { AuthPayloadDto } from './dto/auth-payload.dto';
import { JwtGuard } from './guards/jwt.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(@Body() createUsersDto: CreateUsersDto) {
    return this.authService.signUp(createUsersDto);
  }

  @Post('/signin')
  signIn(@Body() authPayloadDto: AuthPayloadDto, @Res({ passthrough: true }) response: Response) {
    return this.authService.signIn(authPayloadDto, response);
  }

  @UseGuards(JwtGuard)
  @Get('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    return this.authService.logout(req.user?.['sub'], response);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  refreshToken(@Req() req: Request) {
    const userId = req.user?.['sub'];
    const refreshToken = req.user?.['refresh_token'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
