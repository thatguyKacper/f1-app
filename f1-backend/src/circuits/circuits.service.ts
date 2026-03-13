import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

export interface LapRecord {
  time: string;
  driverName: string;
  year: number;
}

export interface CircuitProfile {
  id: number;
  name: string;
  locality: string | null;
  country: string | null;
  lapRecord: LapRecord | null;
  racesHeldCount: number;
  allRaces: PaginatedCircuitRaces;
}

export interface CircuitRaceDetail {
  year: number;
  raceName: string;
  driverId: number | null;
  driverName: string | null;
  teamId: number | null;
  teamName: string | null;
  time: string | null;
}

export interface PaginatedCircuitRaces {
  results: CircuitRaceDetail[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable()
export class CircuitsService {
  constructor(private prisma: PrismaService) {}

  async getCircuitById(
    id: number,
    page: number = 1,
    limit: number = 10,
    sort?: string,
    order?: string,
  ): Promise<CircuitProfile> {
    const circuit = await this.prisma.formula_one_circuit.findUnique({
      where: { id },
      include: {
        formula_one_round: {
          include: { formula_one_season: true },
          orderBy: { formula_one_season: { year: 'desc' } },
        },
      },
    });

    if (!circuit) throw new NotFoundException('Circuit not found');

    const lapRecordResult = await this.prisma.$queryRaw<LapRecord[]>(Prisma.sql`
      SELECT
        l.time AS "time",
        d.forename || ' ' || d.surname AS "driverName",
        s.year AS "year"
      FROM formula_one_lap l
      JOIN formula_one_sessionentry se ON l.session_entry_id = se.id
      JOIN formula_one_session sess ON se.session_id = sess.id
      JOIN formula_one_round r ON sess.round_id = r.id
      JOIN formula_one_season s ON r.season_id = s.id
      JOIN formula_one_roundentry re ON se.round_entry_id = re.id
      JOIN formula_one_teamdriver td ON re.team_driver_id = td.id
      JOIN formula_one_driver d ON td.driver_id = d.id
      WHERE r.circuit_id = ${id}
        AND sess.type = 'R'
        AND l.time IS NOT NULL
        AND l.time != ''
      ORDER BY l.time ASC
      LIMIT 1;
    `);

    const lapRecord: LapRecord | null =
      lapRecordResult.length > 0
        ? {
            time: lapRecordResult[0].time,
            driverName: lapRecordResult[0].driverName,
            year: Number(lapRecordResult[0].year),
          }
        : null;

    let orderSql = Prisma.sql`ORDER BY s.year DESC, r.number DESC`;
    if (sort === 'year') {
      if (order === 'asc')
        orderSql = Prisma.sql`ORDER BY s.year ASC, r.number ASC`;
      if (order === 'desc')
        orderSql = Prisma.sql`ORDER BY s.year DESC, r.number DESC`;
    }

    const countResult = await this.prisma.$queryRaw<
      { count: bigint }[]
    >(Prisma.sql`
          SELECT COUNT(*) as count FROM formula_one_round r
          JOIN formula_one_session sess ON sess.round_id = r.id
          WHERE r.circuit_id = ${id} AND sess.type = 'R'
        `);

    const total = Number(countResult[0]?.count || 0);
    const totalPages = Math.ceil(total / limit);
    const safePage = Math.max(1, Math.min(page, totalPages || 1));
    const offset = (safePage - 1) * limit;

    const allRacesRaw = await this.prisma.$queryRaw<any[]>(Prisma.sql`
          SELECT
            s.year AS "year", r.name AS "raceName", d.id AS "driverId",
            d.forename || ' ' || d.surname AS "driverName",
            t.id AS "teamId", t.name AS "teamName", se.time AS "time"
          FROM formula_one_round r
          JOIN formula_one_season s ON r.season_id = s.id
          JOIN formula_one_session sess ON sess.round_id = r.id
          LEFT JOIN formula_one_sessionentry se ON se.session_id = sess.id AND se.position = 1
          LEFT JOIN formula_one_roundentry re ON se.round_entry_id = re.id
          LEFT JOIN formula_one_teamdriver td ON re.team_driver_id = td.id
          LEFT JOIN formula_one_driver d ON td.driver_id = d.id
          LEFT JOIN formula_one_team t ON td.team_id = t.id
          WHERE r.circuit_id = ${id} AND sess.type = 'R'
          ${orderSql} LIMIT ${limit} OFFSET ${offset}
        `);

    const paginatedRaces: CircuitRaceDetail[] = allRacesRaw.map((p) => ({
      year: Number(p.year),
      raceName: p.raceName,
      driverId: p.driverId ? Number(p.driverId) : null,
      driverName: p.driverName,
      teamId: p.teamId ? Number(p.teamId) : null,
      teamName: p.teamName,
      time: p.time,
    }));

    return {
      id: circuit.id,
      name: circuit.name || 'Unknown Circuit',
      locality: circuit.locality,
      country: circuit.country,
      lapRecord,
      racesHeldCount: circuit.formula_one_round.length,
      allRaces: { results: paginatedRaces, total, page: safePage, totalPages },
    };
  }
}
