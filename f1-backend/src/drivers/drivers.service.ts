import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

export interface DriverSeasonHistory {
  year: number;
  teamId: number;
  teamName: string;
  points: number;
}

export interface RaceResultDetail {
  year: number;
  raceName: string;
  circuitName: string;
  teamId: number;
  teamName: string;
  position: number | null;
  status: string | null;
}

export interface PaginatedRaceResults {
  results: RaceResultDetail[];
  total: number;
  page: number;
  totalPages: number;
}

export interface DriverProfile {
  id: number;
  forename: string;
  surname: string;
  nationality: string | null;
  wikipedia: string | null;
  carNumber: number | null;
  championships: number;
  careerPoints: number;
  raceWinsList: RaceResultDetail[];
  podiumsList: RaceResultDetail[];
  allResults: PaginatedRaceResults;
  seasonHistory: DriverSeasonHistory[];
}

interface RawTitleCount {
  titles: number | bigint;
}
interface RawPointsSum {
  totalPoints: number | string | null;
}

interface RawSeasonHistory {
  year: number;
  teamId: number;
  teamName: string;
  points: number | string | null;
}

interface RawRaceResult {
  year: number;
  raceName: string;
  circuitName: string;
  teamId: number;
  teamName: string;
  position: number | string | null;
  detail: string | null;
}

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) {}

  async getDriverById(
    id: number,
    page: number = 1,
    limit: number = 10,
    sort?: string,
    order?: string,
  ): Promise<DriverProfile> {
    const driver = await this.prisma.formula_one_driver.findUnique({
      where: { id },
    });

    if (!driver) throw new NotFoundException('Driver not found');

    const championshipsResult = await this.prisma.$queryRaw<
      RawTitleCount[]
    >(Prisma.sql`
      WITH LastRound AS (
        SELECT year, MAX(round_number) as max_round
        FROM formula_one_driverchampionship
        WHERE driver_id = ${id}
        GROUP BY year
      )
      SELECT COUNT(*) as "titles"
      FROM formula_one_driverchampionship dc
      JOIN LastRound lr ON dc.year = lr.year AND dc.round_number = lr.max_round
      WHERE dc.driver_id = ${id} AND dc.position = 1
    `);

    const pointsResult = await this.prisma.$queryRaw<RawPointsSum[]>(Prisma.sql`
      WITH SeasonPoints AS (
        SELECT year, MAX(points) as max_points
        FROM formula_one_driverchampionship
        WHERE driver_id = ${id}
        GROUP BY year
      )
      SELECT SUM(max_points) as "totalPoints"
      FROM SeasonPoints
    `);

    const podiumsDetailsResult = await this.prisma.$queryRaw<
      RawRaceResult[]
    >(Prisma.sql`
      SELECT
        s.year AS "year",
        r.name AS "raceName",
        c.name AS "circuitName",
        t.id AS "teamId",
        t.name AS "teamName",
        se.position AS "position",
        se.detail AS "detail"
      FROM formula_one_sessionentry se
      JOIN formula_one_session sess ON se.session_id = sess.id
      JOIN formula_one_round r ON sess.round_id = r.id
      JOIN formula_one_season s ON r.season_id = s.id
      JOIN formula_one_circuit c ON r.circuit_id = c.id
      JOIN formula_one_roundentry re ON se.round_entry_id = re.id
      JOIN formula_one_teamdriver td ON re.team_driver_id = td.id
      JOIN formula_one_team t ON td.team_id = t.id
      WHERE td.driver_id = ${id} AND sess.type = 'R' AND se.position <= 3
      ORDER BY s.year DESC, r.number DESC
    `);

    const podiumsList: RaceResultDetail[] = podiumsDetailsResult.map((p) => ({
      year: Number(p.year),
      raceName: p.raceName,
      circuitName: p.circuitName,
      teamId: Number(p.teamId),
      teamName: p.teamName,
      position: p.position ? Number(p.position) : null,
      status: p.detail,
    }));

    const raceWinsList = podiumsList.filter((p) => p.position === 1);

    let orderSql = Prisma.sql`ORDER BY s.year DESC, r.number DESC`; // Domyślne (Najnowsze wyścigi)

    if (sort === 'position') {
      if (order === 'asc') {
        orderSql = Prisma.sql`ORDER BY se.position ASC NULLS LAST, s.year DESC, r.number DESC`;
      } else if (order === 'desc') {
        orderSql = Prisma.sql`ORDER BY se.position DESC NULLS LAST, s.year DESC, r.number DESC`;
      }
    }

    const countResult = await this.prisma.$queryRaw<
      { count: bigint }[]
    >(Prisma.sql`
          SELECT COUNT(*) as count
          FROM formula_one_sessionentry se
          JOIN formula_one_roundentry re ON se.round_entry_id = re.id
          JOIN formula_one_teamdriver td ON re.team_driver_id = td.id
          JOIN formula_one_session sess ON se.session_id = sess.id
          WHERE td.driver_id = ${id} AND sess.type = 'R'
        `);

    const total = Number(countResult[0]?.count || 0);
    const totalPages = Math.ceil(total / limit);
    const safePage = Math.max(1, Math.min(page, totalPages || 1));
    const offset = (safePage - 1) * limit;

    const allResultsRaw = await this.prisma.$queryRaw<
      RawRaceResult[]
    >(Prisma.sql`
          SELECT
            s.year AS "year",
            r.name AS "raceName",
            c.name AS "circuitName",
            t.id AS "teamId",
            t.name AS "teamName",
            se.position AS "position",
            se.detail AS "detail"
          FROM formula_one_sessionentry se
          JOIN formula_one_session sess ON se.session_id = sess.id
          JOIN formula_one_round r ON sess.round_id = r.id
          JOIN formula_one_season s ON r.season_id = s.id
          JOIN formula_one_circuit c ON r.circuit_id = c.id
          JOIN formula_one_roundentry re ON se.round_entry_id = re.id
          JOIN formula_one_teamdriver td ON re.team_driver_id = td.id
          JOIN formula_one_team t ON td.team_id = t.id
          WHERE td.driver_id = ${id} AND sess.type = 'R'
          ${orderSql}
          LIMIT ${limit} OFFSET ${offset}
        `);

    const paginatedResults: RaceResultDetail[] = allResultsRaw.map((p) => ({
      year: Number(p.year),
      raceName: p.raceName,
      circuitName: p.circuitName,
      teamId: Number(p.teamId),
      teamName: p.teamName,
      position: p.position ? Number(p.position) : null,
      status: p.detail,
    }));

    const seasonHistoryResult = await this.prisma.$queryRaw<
      RawSeasonHistory[]
    >(Prisma.sql`
      SELECT
        s.year AS "year",
        td.team_id AS "teamId",
        t.name AS "teamName",
        SUM(se.points) AS "points"
      FROM formula_one_sessionentry se
      JOIN formula_one_roundentry re ON se.round_entry_id = re.id
      JOIN formula_one_teamdriver td ON re.team_driver_id = td.id
      JOIN formula_one_team t ON td.team_id = t.id
      JOIN formula_one_session sess ON se.session_id = sess.id
      JOIN formula_one_round r ON sess.round_id = r.id
      JOIN formula_one_season s ON r.season_id = s.id
      WHERE td.driver_id = ${id} AND sess.type = 'R'
      GROUP BY s.year, td.team_id, t.name
      ORDER BY s.year DESC
    `);

    const seasonHistory: DriverSeasonHistory[] = seasonHistoryResult.map(
      (row) => ({
        year: Number(row.year),
        teamId: Number(row.teamId),
        teamName: row.teamName,
        points: row.points ? Number(row.points) : 0,
      }),
    );

    return {
      id: driver.id,
      forename: driver.forename || '',
      surname: driver.surname || '',
      nationality: driver.nationality,
      wikipedia: driver.wikipedia,
      carNumber: driver.permanent_car_number,
      championships: championshipsResult[0]?.titles
        ? Number(championshipsResult[0].titles)
        : 0,
      careerPoints: pointsResult[0]?.totalPoints
        ? Number(pointsResult[0].totalPoints)
        : 0,
      raceWinsList,
      podiumsList,
      allResults: {
        results: paginatedResults,
        total,
        page: safePage,
        totalPages,
      },
      seasonHistory,
    };
  }
}
