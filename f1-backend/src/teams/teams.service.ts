import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

export interface TeamDriverHistory {
  driverId: number;
  driverName: string;
  years: string;
  points: number;
}

export interface TeamProfile {
  id: number;
  name: string;
  nationality: string | null;
  wikipedia: string | null;
  championships: number;
  raceWins: number;
  totalPoints: number;
  driversHistory: TeamDriverHistory[];
}

interface RawCount {
  count: number | bigint | null;
}

interface RawDriverPoints {
  driverId: number;
  points: number | string | null;
}

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async getTeamById(id: number): Promise<TeamProfile> {
    const team = await this.prisma.formula_one_team.findUnique({
      where: { id },
      include: {
        formula_one_teamdriver: {
          include: {
            formula_one_driver: true,
            formula_one_season: true,
          },
        },
      },
    });

    if (!team) throw new NotFoundException('Team not found');

    const championshipsResult = await this.prisma.$queryRaw<
      RawCount[]
    >(Prisma.sql`
      WITH LastRound AS (
        SELECT year, MAX(round_number) as max_round
        FROM formula_one_teamchampionship
        WHERE team_id = ${id}
        GROUP BY year
      )
      SELECT COUNT(*) as "count"
      FROM formula_one_teamchampionship tc
      JOIN LastRound lr ON tc.year = lr.year AND tc.round_number = lr.max_round
      WHERE tc.team_id = ${id} AND tc.position = 1
    `);

    const winsResult = await this.prisma.$queryRaw<RawCount[]>(Prisma.sql`
      SELECT MAX(win_count) as "count"
      FROM formula_one_teamchampionship
      WHERE team_id = ${id}
    `);

    const pointsResult = await this.prisma.$queryRaw<RawCount[]>(Prisma.sql`
      WITH SeasonPoints AS (
        SELECT year, MAX(points) as max_points
        FROM formula_one_teamchampionship
        WHERE team_id = ${id}
        GROUP BY year
      )
      SELECT SUM(max_points) as "count"
      FROM SeasonPoints
    `);

    const driverPointsResult = await this.prisma.$queryRaw<
      RawDriverPoints[]
    >(Prisma.sql`
      SELECT
        td.driver_id AS "driverId",
        SUM(se.points) AS "points"
      FROM formula_one_teamdriver td
      JOIN formula_one_roundentry re ON re.team_driver_id = td.id
      JOIN formula_one_sessionentry se ON se.round_entry_id = re.id
      WHERE td.team_id = ${id}
      GROUP BY td.driver_id
    `);

    const driverPointsMap = new Map<number, number>();
    for (const row of driverPointsResult) {
      driverPointsMap.set(row.driverId, row.points ? Number(row.points) : 0);
    }

    const driversMap = new Map<
      number,
      { driverName: string; years: number[] }
    >();

    for (const td of team.formula_one_teamdriver) {
      if (td.formula_one_driver && td.formula_one_season?.year) {
        const dId = td.formula_one_driver.id;
        if (!driversMap.has(dId)) {
          driversMap.set(dId, {
            driverName: `${td.formula_one_driver.forename} ${td.formula_one_driver.surname}`,
            years: [],
          });
        }
        driversMap.get(dId)!.years.push(td.formula_one_season.year);
      }
    }

    const driversHistory: TeamDriverHistory[] = Array.from(
      driversMap.entries(),
    ).map(([driverId, data]) => {
      const sortedYears = Array.from(new Set(data.years)).sort((a, b) => b - a); // Najnowsze lata na początku

      const yearsStr =
        sortedYears.length > 2
          ? `${sortedYears[sortedYears.length - 1]} - ${sortedYears[0]}`
          : sortedYears.join(', ');

      return {
        driverId,
        driverName: data.driverName,
        years: yearsStr,
        points: driverPointsMap.get(driverId) || 0,
      };
    });

    driversHistory.sort((a, b) => b.points - a.points);

    return {
      id: team.id,
      name: team.name || 'Unknown Team',
      nationality: team.nationality,
      wikipedia: team.wikipedia,
      championships: championshipsResult[0]?.count
        ? Number(championshipsResult[0].count)
        : 0,
      raceWins: winsResult[0]?.count ? Number(winsResult[0].count) : 0,
      totalPoints: pointsResult[0]?.count ? Number(pointsResult[0].count) : 0,
      driversHistory,
    };
  }
}
