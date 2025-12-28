import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../decorators/public.decorator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Check application health' })
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB threshold
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024), // 300MB threshold
    ]);
  }

  @Get('readiness')
  @Public()
  @ApiOperation({ summary: 'Application readiness probe' })
  readiness() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('liveness')
  @Public()
  @ApiOperation({ summary: 'Application liveness probe' })
  liveness() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
