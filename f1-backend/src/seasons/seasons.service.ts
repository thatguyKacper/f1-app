import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

export interface RaceResult {
  roundId: number;
  roundNumber: number;
  raceName: string;
  raceDate: Date;
  circuitName: string;
  country: string;
  winnerName: string | null;
  teamName: string | null;
}

@Injectable()
export class SeasonsService {
  constructor(private prisma: PrismaService) {}

  async getAllSeasons(): Promise<number[]> {
    const seasons = await this.prisma.formula_one_season.findMany({
      select: { year: true },
      orderBy: { year: 'desc' },
    });
    return seasons.map((s) => s.year as number);
  }

  async getSeasonRaces(year: number): Promise<RaceResult[]> {
    const races = await this.prisma.$queryRaw<RaceResult[]>(
      Prisma.sql`
        SELECT
            r.id AS "roundId",
            r.number AS "roundNumber",
            r.name AS "raceName",
            r.date AS "raceDate",
            c.name AS "circuitName",
            c.country AS "country",
            d.forename || ' ' || d.surname AS "winnerName",
            t.name AS "teamName"
        FROM formula_one_season s
        JOIN formula_one_round r ON r.season_id = s.id
        JOIN formula_one_circuit c ON r.circuit_id = c.id
        LEFT JOIN formula_one_session sess ON sess.round_id = r.id AND sess.type = 'R'
        LEFT JOIN formula_one_sessionentry se ON se.session_id = sess.id AND se.position = 1 AND se.is_classified = TRUE
        LEFT JOIN formula_one_roundentry re ON se.round_entry_id = re.id
        LEFT JOIN formula_one_teamdriver td ON re.team_driver_id = td.id
        LEFT JOIN formula_one_driver d ON td.driver_id = d.id
        LEFT JOIN formula_one_team t ON td.team_id = t.id
        WHERE s.year = ${year} AND r.is_cancelled = FALSE
        ORDER BY r.date ASC;
      `,
    );

    return races;
  }
}
