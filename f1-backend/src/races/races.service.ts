import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

export interface RoundDetails {
  roundId: number;
  raceName: string;
  date: Date;
  circuitName: string;
  country: string;
}

export interface RaceResult {
  position: number | null;
  carNumber: number | null;
  driverName: string;
  teamName: string;
  laps: number;
  time: string | null;
  points: number;
  status: string | null;
}

@Injectable()
export class RacesService {
  constructor(private prisma: PrismaService) {}

  async getRoundDetails(roundId: number): Promise<RoundDetails> {
    const rounds = await this.prisma.$queryRaw<RoundDetails[]>(
      Prisma.sql`
        SELECT
            r.id AS "roundId",
            r.name AS "raceName",
            r.date AS "date",
            c.name AS "circuitName",
            c.country AS "country"
        FROM formula_one_round r
        JOIN formula_one_circuit c ON r.circuit_id = c.id
        WHERE r.id = ${roundId};
      `,
    );

    if (!rounds.length) {
      throw new NotFoundException(`Round with ID ${roundId} not found`);
    }

    return rounds[0];
  }

  async getRaceResults(roundId: number): Promise<RaceResult[]> {
    return this.prisma.$queryRaw<RaceResult[]>(
      Prisma.sql`
        SELECT
            se.position,
            re.car_number AS "carNumber",
            d.forename || ' ' || d.surname AS "driverName",
            t.name AS "teamName",
            se.laps_completed AS "laps",
            se.time AS "time",
            se.points,
            se.detail AS "status"
        FROM formula_one_session sess
        JOIN formula_one_sessionentry se ON se.session_id = sess.id
        JOIN formula_one_roundentry re ON se.round_entry_id = re.id
        JOIN formula_one_teamdriver td ON re.team_driver_id = td.id
        JOIN formula_one_driver d ON td.driver_id = d.id
        JOIN formula_one_team t ON td.team_id = t.id
        WHERE sess.round_id = ${roundId}
          AND sess.type = 'R' -- Zapewnia, że bierzemy tylko wyścig (omijamy kwalifikacje, treningi)
        ORDER BY
          -- Sortujemy po pozycji (ale omijamy NULL dla tych, co nie ukończyli, dając ich na koniec)
          CASE WHEN se.position IS NULL THEN 1 ELSE 0 END,
          se.position ASC;
      `,
    );
  }
}
