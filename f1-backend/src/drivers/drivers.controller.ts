import { Controller, Get, Param, Query } from '@nestjs/common';
import { DriversService } from './drivers.service.js';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get(':id')
  async getDriver(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    const driver = await this.driversService.getDriverById(
      Number(id),
      pageNum,
      limitNum,
      sort,
      order,
    );
    return { data: driver };
  }
}
