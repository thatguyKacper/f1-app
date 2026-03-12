import { Controller, Get, Param } from '@nestjs/common';
import { CircuitsService } from './circuits.service.js';

@Controller('circuits')
export class CircuitsController {
  constructor(private readonly circuitsService: CircuitsService) {}

  @Get(':id')
  async getCircuit(@Param('id') id: string) {
    const circuit = await this.circuitsService.getCircuitById(Number(id));
    return { data: circuit };
  }
}
