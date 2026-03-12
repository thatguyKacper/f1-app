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
  nationality: string;
  teamName: string;
  points: number;
  wins: number;
  drivers: string;
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
            t.id AS "teamId",
            t.name AS "teamName"
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
        GROUP BY d.id, dc.position, d.forename, d.surname, d.nationality, dc.points, dc.win_count, t.id
        ORDER BY dc.position ASC;
      `,
    );
  }

  async getTeamStandings(year: number): Promise<TeamStanding[]> {
    return this.prisma.$queryRaw<TeamStanding[]>(
      Prisma.sql`
        SELECT
          t.id AS "teamId",
          tc.position,
          t.name AS "teamName",
          t.nationality,
          tc.points,
          tc.win_count AS "wins",
          STRING_AGG(DISTINCT d.id::text || '|' || d.forename || ' ' || d.surname, ',') AS "drivers"
      FROM formula_one_teamchampionship tc
      JOIN formula_one_team t ON tc.team_id = t.id
      LEFT JOIN formula_one_teamdriver td ON td.team_id = t.id AND td.season_id = tc.season_id
      LEFT JOIN formula_one_driver d ON td.driver_id = d.id
      WHERE tc.year = ${year}
        AND tc.round_number = (
            SELECT MAX(round_number)
            FROM formula_one_teamchampionship
            WHERE year = ${year}
        )
      GROUP BY t.id, tc.position, t.name, t.nationality, tc.points, tc.win_count
      ORDER BY tc.position ASC;
      `,
    );
  }
}
