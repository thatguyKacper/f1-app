import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StandingsService } from './standings.service.js';

@Controller('standings')
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) {}

  @Get('drivers/:year')
  async getDriverStandings(@Param('year', ParseIntPipe) year: number) {
    const data = await this.standingsService.getDriverStandings(year);
    return {
      status: 'success',
      data: {
        year,
        standings: data,
      },
    };
  }

  @Get('teams/:year')
  async getTeamStandings(@Param('year', ParseIntPipe) year: number) {
    const data = await this.standingsService.getTeamStandings(year);
    return {
      status: 'success',
      data: {
        year,
        standings: data,
      },
    };
  }
}
