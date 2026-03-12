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
  recentRaces: {
    id: number;
    name: string;
    year: number;
  }[];
}

@Injectable()
export class CircuitsService {
  constructor(private prisma: PrismaService) {}

  async getCircuitById(id: number): Promise<CircuitProfile> {
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

    return {
      id: circuit.id,
      name: circuit.name || 'Unknown Circuit',
      locality: circuit.locality,
      country: circuit.country,
      lapRecord,
      racesHeldCount: circuit.formula_one_round.length,
      recentRaces: circuit.formula_one_round.slice(0, 5).map((r) => ({
        id: r.id,
        name: r.name || 'Grand Prix',
        year: r.formula_one_season?.year || 0,
      })),
    };
  }
}
