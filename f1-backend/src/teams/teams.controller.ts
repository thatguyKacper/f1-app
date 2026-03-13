import { Controller, Get, Param, Query } from '@nestjs/common';
import { TeamsService } from './teams.service.js';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get(':id')
  async getTeam(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const team = await this.teamsService.getTeamById(
      Number(id),
      pageNum,
      limitNum,
      sort,
      order,
    );
    return { data: team };
  }
}
