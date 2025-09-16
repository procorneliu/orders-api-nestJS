import { Controller, Get, Post, Body, Req, UseGuards, ForbiddenException, HttpCode, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsersDto } from '../users/dtos/create-user.dto';
import { AuthDto } from './dtos/auth.dto';
import { AccessTokenGuard } from './guards/accessToken.guard';
import type { Request, Response } from 'express';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { LogoutResponseDto } from './dtos/logout-response.dto';
import { RefreshResponseDto } from './dtos/refresh-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiSuccessResponse(AuthResponseDto)
  @Post('signup')
  signUp(@Body() createUsersDto: CreateUsersDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signUp(createUsersDto, res);
  }

  @ApiSuccessResponse(AuthResponseDto)
  @HttpCode(200)
  @Post('signin')
  signIn(@Body() authDto: AuthDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(authDto, res);
  }

  @ApiSuccessResponse(LogoutResponseDto)
  @UseGuards(AccessTokenGuard)
  @Get('/logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req.user!['sub'], res);
  }

  @ApiSuccessResponse(RefreshResponseDto)
  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  refresh(@Req() req: Request) {
    if (!req.user) throw new ForbiddenException('Access denied');

    const email = req.user['email'];
    const refreshToken = req.user['refreshToken'];

    return this.authService.refreshTokens(email, refreshToken);
  }
}
