import { Controller, Get, Param, Query } from '@nestjs/common';
import { CircuitsService } from './circuits.service.js';

@Controller('circuits')
export class CircuitsController {
  constructor(private readonly circuitsService: CircuitsService) {}

  @Get(':id')
  async getCircuit(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const circuit = await this.circuitsService.getCircuitById(
      Number(id),
      pageNum,
      limitNum,
      sort,
      order,
    );
    return { data: circuit };
  }
}
