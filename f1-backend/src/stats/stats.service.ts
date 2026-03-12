import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

export interface FastestPitStop {
  duration: string;
  driverName: string;
  teamName: string;
  year: number;
}

export interface DriverStatCount {
  driverName: string;
  count: number;
}

export interface TeamStatCount {
  teamName: string;
  count: number;
}

export interface StatsResponse {
  fastestPitStops: FastestPitStop[];
  mostDnfs: DriverStatCount[];
  mostChampionships: DriverStatCount[];
  mostTeamChampionships: TeamStatCount[];
  mostRaceWins: DriverStatCount[];
  mostRaceStarts: DriverStatCount[];
  mostLapsCompleted: DriverStatCount[];
}

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getStats(): Promise<StatsResponse> {
    const [
      fastestPitStops,
      mostDnfs,
      mostChampionships,
      mostTeamChampionships,
      mostRaceWins,
      mostRaceStarts,
      mostLapsCompleted,
    ] = await Promise.all([
      this.getFastestPitStops(5),
      this.getMostDnfs(5),
      this.getMostChampionships(5),
      this.getMostTeamChampionships(5),
      this.getMostRaceWins(5),
      this.getMostRaceStarts(5),
      this.getMostLapsCompleted(5),
    ]);

    return {
      fastestPitStops,
      mostDnfs,
      mostChampionships,
      mostTeamChampionships,
      mostRaceWins,
      mostRaceStarts,
      mostLapsCompleted,
    };
  }

  async getFastestPitStops(limit: number): Promise<FastestPitStop[]> {
    const result = await this.prisma.$queryRaw<FastestPitStop[]>(Prisma.sql`
        SELECT
          p.duration AS "duration",
          d.forename || ' ' || d.surname AS "driverName",
          t.name AS "teamName",
          s.year AS "year"
        FROM formula_one_pitstop p
        JOIN formula_one_sessionentry se ON p.session_entry_id = se.id
        JOIN formula_one_roundentry re ON se.round_entry_id = re.id
        JOIN formula_one_teamdriver td ON re.team_driver_id = td.id
        JOIN formula_one_driver d ON td.driver_id = d.id
        JOIN formula_one_team t ON td.team_id = t.id
        JOIN formula_one_session sess ON se.session_id = sess.id
        JOIN formula_one_round r ON sess.round_id = r.id
        JOIN formula_one_season s ON r.season_id = s.id
        WHERE p.duration IS NOT NULL
          AND p.duration != ''
          AND p.duration != '00:00:00'
          AND p.duration != '00:00:00.000'
        ORDER BY p.duration ASC
        LIMIT ${limit};
      `);

    return result.map((r) => {
      let formattedDuration = r.duration;

      if (formattedDuration.startsWith('00:00:')) {
        formattedDuration = formattedDuration.substring(6);
      } else if (formattedDuration.startsWith('00:')) {
        formattedDuration = formattedDuration.substring(3);
      }

      return {
        duration: formattedDuration,
        driverName: r.driverName,
        teamName: r.teamName,
        year: Number(r.year),
      };
    });
  }

  async getMostDnfs(limit: number): Promise<DriverStatCount[]> {
    const result = await this.prisma.$queryRaw<DriverStatCount[]>(Prisma.sql`
        SELECT
          d.forename || ' ' || d.surname AS "driverName",
          COUNT(*) AS "count"
        FROM formula_one_sessionentry se
        JOIN formula_one_roundentry re ON se.round_entry_id = re.id
        JOIN formula_one_teamdriver td ON re.team_driver_id = td.id
        JOIN formula_one_driver d ON td.driver_id = d.id
        -- Usunęliśmy sess.type = 'R',
        WHERE se.is_classified = false
        GROUP BY d.id, d.forename, d.surname
        ORDER BY "count" DESC
        LIMIT ${limit};
      `);

    return result.map((r) => ({
      driverName: r.driverName,
      count: Number(r.count),
    }));
  }

  async getMostChampionships(limit: number): Promise<DriverStatCount[]> {
    const result = await this.prisma.$queryRaw<DriverStatCount[]>(Prisma.sql`
      WITH LastRound AS (
        SELECT year, MAX(round_number) as max_round
        FROM formula_one_driverchampionship
        GROUP BY year
      )
      SELECT
        d.forename || ' ' || d.surname AS "driverName",
        COUNT(*) AS "count"
      FROM formula_one_driverchampionship dc
      JOIN LastRound lr ON dc.year = lr.year AND dc.round_number = lr.max_round
      JOIN formula_one_driver d ON dc.driver_id = d.id
      WHERE dc.position = 1
      GROUP BY d.id, d.forename, d.surname
      ORDER BY "count" DESC
      LIMIT ${limit};
    `);
    return result.map((r) => ({
      driverName: r.driverName,
      count: Number(r.count),
    }));
  }

  async getMostTeamChampionships(limit: number): Promise<TeamStatCount[]> {
    const result = await this.prisma.$queryRaw<TeamStatCount[]>(Prisma.sql`
      WITH LastRound AS (
        SELECT year, MAX(round_number) as max_round
        FROM formula_one_teamchampionship
        GROUP BY year
      )
      SELECT
        t.name AS "teamName",
        COUNT(*) AS "count"
      FROM formula_one_teamchampionship tc
      JOIN LastRound lr ON tc.year = lr.year AND tc.round_number = lr.max_round
      JOIN formula_one_team t ON tc.team_id = t.id
      WHERE tc.position = 1
      GROUP BY t.id, t.name
      ORDER BY "count" DESC
      LIMIT ${limit};
    `);
    return result.map((r) => ({
      teamName: r.teamName,
      count: Number(r.count),
    }));
  }

  async getMostRaceWins(limit: number): Promise<DriverStatCount[]> {
    const result = await this.prisma.$queryRaw<DriverStatCount[]>(Prisma.sql`
      SELECT
        d.forename || ' ' || d.surname AS "driverName",
        MAX(dc.win_count) AS "count"
      FROM formula_one_driverchampionship dc
      JOIN formula_one_driver d ON dc.driver_id = d.id
      GROUP BY d.id, d.forename, d.surname
      ORDER BY "count" DESC
      LIMIT ${limit};
    `);
    return result.map((r) => ({
      driverName: r.driverName,
      count: Number(r.count),
    }));
  }

  async getMostRaceStarts(limit: number): Promise<DriverStatCount[]> {
    const result = await this.prisma.$queryRaw<DriverStatCount[]>(Prisma.sql`
      SELECT
        d.forename || ' ' || d.surname AS "driverName",
        COUNT(se.id) AS "count"
      FROM formula_one_sessionentry se
      JOIN formula_one_roundentry re ON se.round_entry_id = re.id
      JOIN formula_one_teamdriver td ON re.team_driver_id = td.id
      JOIN formula_one_driver d ON td.driver_id = d.id
      JOIN formula_one_session sess ON se.session_id = sess.id
      WHERE sess.type = 'R' -- <--- Zmiana z 'Race' na 'R'
      GROUP BY d.id, d.forename, d.surname
      ORDER BY "count" DESC
      LIMIT ${limit};
      `);

    return result.map((r) => ({
      driverName: r.driverName,
      count: Number(r.count),
    }));
  }

  async getMostLapsCompleted(limit: number): Promise<DriverStatCount[]> {
    const result = await this.prisma.$queryRaw<DriverStatCount[]>(Prisma.sql`
      SELECT
        d.forename || ' ' || d.surname AS "driverName",
        SUM(se.laps_completed) AS "count"
      FROM formula_one_sessionentry se
      JOIN formula_one_roundentry re ON se.round_entry_id = re.id
      JOIN formula_one_teamdriver td ON re.team_driver_id = td.id
      JOIN formula_one_driver d ON td.driver_id = d.id
      JOIN formula_one_session sess ON se.session_id = sess.id
      WHERE sess.type = 'R' AND se.laps_completed IS NOT NULL -- <--- Zmiana z 'Race' na 'R'
      GROUP BY d.id, d.forename, d.surname
      ORDER BY "count" DESC
      LIMIT ${limit};
    `);

    return result.map((r) => ({
      driverName: r.driverName,
      count: Number(r.count),
    }));
  }
}
