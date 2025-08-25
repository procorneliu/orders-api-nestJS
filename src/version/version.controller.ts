import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as pkg from './../../package.json';

@Controller('version')
export class VersionController {
  constructor(private configService: ConfigService) {}

  @Get()
  version() {
    return {
      app: pkg.name,
      version: pkg.version,
      env: this.configService.get('NODE_ENV'),
    };
  }
}
