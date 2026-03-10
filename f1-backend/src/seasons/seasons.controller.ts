import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SeasonsService } from './seasons.service.js';

@Controller('seasons')
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Get()
  async getAllSeasons() {
    const data = await this.seasonsService.getAllSeasons();
    return {
      status: 'success',
      data,
    };
  }

  @Get(':year')
  async getSeasonRaces(@Param('year', ParseIntPipe) year: number) {
    const data = await this.seasonsService.getSeasonRaces(year);
    return {
      status: 'success',
      data: {
        year,
        races: data,
      },
    };
  }
}
