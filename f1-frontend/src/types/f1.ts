// src/types/f1.ts

export interface ApiResponse<T> {
  status: string
  data: T
}

export interface SeasonRace {
  roundId: number
  roundNumber: number
  raceName: string
  raceDate: string
  circuitId: number
  circuitName: string
  country: string
  driverId: number
  winnerName: string | null
  teamId: number
  teamName: string | null
}

export interface DriverStanding {
  driverId: number
  position: number
  driverName: string
  nationality: string | null
  points: number
  wins: number
  teamId: number
  teamName: string | null
}

export interface TeamStanding {
  teamId: number
  position: number
  nationality: string
  teamName: string
  driverId: number
  drivers: string
  points: number
  wins: number
}

export interface RaceResult {
  position: number | null
  carNumber: number | null
  driverId: string
  driverName: string
  teamId: number
  teamName: string
  laps: number
  time: string | null
  points: number
  status: string | null
}

export interface PaginatedRaceResults {
  results: RaceResultDetail[]
  total: number
  page: number
  totalPages: number
}

export interface RoundDetails {
  roundId: number
  raceName: string
  date: string
  circuitName: string
  country: string
}

export interface FastestPitStop {
  duration: string
  driverName: string
  teamName: string
  year: number
}

export interface DriverStatCount {
  driverName: string
  count: number
}

export interface TeamStatCount {
  teamName: string
  count: number
}

export interface CircuitProfile {
  id: number
  name: string
  locality: string | null
  country: string | null
  lapRecord: { time: string; driverName: string; year: number } | null
  racesHeldCount: number
  recentRaces: { id: number; name: string; year: number }[]
}

export interface DriverTeamHistory {
  teamId: number
  teamName: string
  year: number
}

export interface RaceResultDetail {
  year: number
  raceName: string
  circuitName: string
  position: number
}

export interface DriverProfile {
  id: number
  forename: string
  surname: string
  nationality: string | null
  wikipedia: string | null
  carNumber: number | null
  careerWins: number
  careerPodiums: number
  championships: number
  careerPoints: number
  raceWinsList: RaceResultDetail[]
  podiumsList: RaceResultDetail[]
  seasonHistory: {
    year: number
    teamId: number
    teamName: string
    points: number
  }[]
  allResults: PaginatedRaceResults[]
}

export interface TeamProfile {
  id: number
  name: string
  nationality: string | null
  wikipedia: string | null
  championships: number
  raceWins: number
  totalPoints: number
  driversHistory: {
    driverId: number
    driverName: string
    years: string
    points: number
  }[]
}
