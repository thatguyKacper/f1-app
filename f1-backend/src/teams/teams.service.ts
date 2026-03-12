import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async getTeamById(id: number) {
    const team = await this.prisma.formula_one_team.findUnique({
      where: { id },
      include: {
        formula_one_teamdriver: {
          include: {
            formula_one_driver: true,
            formula_one_season: true,
          },
          orderBy: { formula_one_season: { year: 'desc' } },
        },
      },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team;
  }
}
