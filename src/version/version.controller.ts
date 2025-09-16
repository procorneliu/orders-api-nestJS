import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as pkg from './../../package.json';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { VersionDto } from './dtos/version.dto';
import { ResponseStatusDto } from 'src/common/dtos/response-status.dto';

@Controller('version')
export class VersionController {
  constructor(private configService: ConfigService) {}

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseStatusDto) },
        {
          properties: {
            status: { type: 'string', enum: ['success'] },
            data: { $ref: getSchemaPath(VersionDto) },
          },
        },
      ],
    },
  })
  @Get()
  version() {
    return {
      app: pkg.name,
      version: pkg.version,
      env: this.configService.get('NODE_ENV'),
    };
  }
}
