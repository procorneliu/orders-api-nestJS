import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as pkg from './../../package.json';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { VersionDto } from './dtos/version.dto';

@Controller('version')
export class VersionController {
  constructor(private configService: ConfigService) {}

  @ApiSuccessResponse(VersionDto)
  @Get()
  version() {
    return {
      app: pkg.name,
      version: pkg.version,
      env: this.configService.get('NODE_ENV'),
    };
  }
}
