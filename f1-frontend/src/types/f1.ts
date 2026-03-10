// src/types/f1.ts

export interface PodiumDriver {
  raceName: string
  raceDate: string
  position: number
  driverName: string
  teamName: string
  totalTime: string
  isFastestLap: boolean
}

export interface ApiResponse<T> {
  success: boolean
  count: number
  data: T
}
