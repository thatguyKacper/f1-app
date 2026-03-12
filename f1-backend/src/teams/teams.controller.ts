import { Controller, Get, Param } from '@nestjs/common';
import { TeamsService } from './teams.service.js';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get(':id')
  async getTeam(@Param('id') id: string) {
    const team = await this.teamsService.getTeamById(Number(id));
    return { data: team };
  }
}
