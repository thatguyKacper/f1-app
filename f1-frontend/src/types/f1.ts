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
  teamName: string | null
}

export interface TeamStanding {
  teamId: number
  position: number
  teamName: string
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

export interface RoundDetails {
  roundId: number
  raceName: string
  date: string
  circuitName: string
  country: string
}
