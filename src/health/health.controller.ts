import { Controller, Get } from '@nestjs/common';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { HealthDto } from './dtos/health.dto';

@Controller('health')
export class HealthController {
  @ApiSuccessResponse(HealthDto)
  @Get()
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
