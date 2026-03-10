import { Controller, Get } from '@nestjs/common';
import { F1Service } from './f1.service.js';

@Controller()
export class F1Controller {
  constructor(private readonly f1Service: F1Service) {}

  /**
   * GET /f1/latest-podium
   * Retrieves the top 3 drivers and the driver with the fastest lap
   * from the most recently completed race.
   */
  @Get('latest-podium')
  async getLatestPodium() {
    const data = await this.f1Service.getLatestRacePodium();

    return {
      success: true,
      // Prisma's $queryRaw returns an array, but type assertions might be needed in strict mode
      count: Array.isArray(data) ? data.length : 0,
      data: data,
    };
  }
}
