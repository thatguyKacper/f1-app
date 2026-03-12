import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service.js';

@Controller('stats')
export class StatsController {
  constructor(private readonly StatsService: StatsService) {}

  @Get()
  async getStats() {
    const data = await this.StatsService.getStats();
    return { data };
  }
}
