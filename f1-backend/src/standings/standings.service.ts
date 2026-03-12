import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

export interface DriverStanding {
  driverId: number;
  position: number;
  driverName: string;
  nationality: string | null;
  points: number;
  wins: number;
  teamName: string | null;
}

export interface TeamStanding {
  teamId: number;
  position: number;
  teamName: string;
  points: number;
  wins: number;
}

@Injectable()
export class StandingsService {
  constructor(private prisma: PrismaService) {}

  async getDriverStandings(year: number): Promise<DriverStanding[]> {
    return this.prisma.$queryRaw<DriverStanding[]>(
      Prisma.sql`
        SELECT
            d.id AS "driverId",
            dc.position,
            d.forename || ' ' || d.surname AS "driverName",
            d.nationality,
            dc.points,
            dc.win_count AS "wins",
            STRING_AGG(DISTINCT t.name, ', ') AS "teamName"
        FROM formula_one_driverchampionship dc
        JOIN formula_one_driver d ON dc.driver_id = d.id
        LEFT JOIN formula_one_teamdriver td ON td.driver_id = d.id AND td.season_id = dc.season_id
        LEFT JOIN formula_one_team t ON td.team_id = t.id
        WHERE dc.year = ${year}
          AND dc.round_number = (
              SELECT MAX(round_number)
              FROM formula_one_driverchampionship
              WHERE year = ${year}
          )
        GROUP BY d.id, dc.position, d.forename, d.surname, d.nationality, dc.points, dc.win_count
        ORDER BY dc.position ASC;
      `,
    );
  }

  async getTeamStandings(year: number): Promise<TeamStanding[]> {
    return this.prisma.$queryRaw<TeamStanding[]>(
      Prisma.sql`
        SELECT
            t.id as "teamId",
            tc.position,
            t.name AS "teamName",
            tc.points,
            tc.win_count AS "wins"
        FROM formula_one_teamchampionship tc
        JOIN formula_one_team t ON tc.team_id = t.id
        WHERE tc.year = ${year}
          AND tc.round_number = (
              SELECT MAX(round_number)
              FROM formula_one_teamchampionship
              WHERE year = ${year}
          )
        ORDER BY tc.position ASC;
      `,
    );
  }
}
