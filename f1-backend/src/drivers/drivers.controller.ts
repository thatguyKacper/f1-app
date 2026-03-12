import { Controller, Get, Param } from '@nestjs/common';
import { DriversService } from './drivers.service.js';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get(':id')
  async getDriver(@Param('id') id: string) {
    const driver = await this.driversService.getDriverById(Number(id));
    return { data: driver };
  }
}
