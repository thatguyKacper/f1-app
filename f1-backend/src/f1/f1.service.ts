import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class F1Service {
  constructor(private prisma: PrismaService) {}

  /**
   * Fetches the podium (top 3) and the fastest lap driver
   * from the most recently completed race in the database.
   */
  async getLatestRacePodium() {
    const result = await this.prisma.$queryRaw`
      WITH LastRace AS (
          SELECT
              s.id AS session_id,
              r.name AS race_name,
              r.date
          FROM formula_one_round r
          JOIN formula_one_session s ON s.round_id = r.id
          WHERE s.type = 'R'
            AND r.is_cancelled = FALSE
            AND EXISTS (
                SELECT 1 FROM formula_one_sessionentry se WHERE se.session_id = s.id
            )
          ORDER BY r.date DESC
          LIMIT 1
      ),
      RaceResults AS (
          SELECT
              lr.race_name,
              lr.date,
              se.position,
              d.forename || ' ' || d.surname AS driver_name,
              t.name AS team_name,
              se.time AS total_time,
              se.fastest_lap_rank
          FROM LastRace lr
          JOIN formula_one_sessionentry se ON se.session_id = lr.session_id
          JOIN formula_one_roundentry re ON se.round_entry_id = re.id
          JOIN formula_one_teamdriver td ON re.team_driver_id = td.id
          JOIN formula_one_driver d ON td.driver_id = d.id
          JOIN formula_one_team t ON td.team_id = t.id
          WHERE se.is_classified = TRUE
      )
      SELECT
          race_name AS "raceName",
          date AS "raceDate",
          position,
          driver_name AS "driverName",
          team_name AS "teamName",
          total_time AS "totalTime",
          fastest_lap_rank = 1 AS "isFastestLap"
      FROM RaceResults
      WHERE position <= 3 OR fastest_lap_rank = 1
      ORDER BY position;
    `;

    return result;
  }
}
