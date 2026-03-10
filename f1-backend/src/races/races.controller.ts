import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RacesService } from './races.service.js';

@Controller('races')
export class RacesController {
  constructor(private readonly racesService: RacesService) {}

  @Get(':roundId')
  async getRoundDetails(@Param('roundId', ParseIntPipe) roundId: number) {
    const data = await this.racesService.getRoundDetails(roundId);
    return {
      status: 'success',
      data,
    };
  }

  @Get(':roundId/results')
  async getRaceResults(@Param('roundId', ParseIntPipe) roundId: number) {
    const data = await this.racesService.getRaceResults(roundId);
    return {
      status: 'success',
      data: {
        roundId,
        results: data,
      },
    };
  }
}
