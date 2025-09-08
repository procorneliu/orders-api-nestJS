import { Controller, Post, Get, Req, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth-payload.dto';
import { LocalGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('/login')
  login(@Req() req: Request) {
    return req.user;
  }

  @Get('/status')
  @UseGuards(JwtGuard)
  status(@Req() req: Request) {
    return req.user;
  }
}
