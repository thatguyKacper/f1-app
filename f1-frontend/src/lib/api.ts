// src/lib/api.ts
import {
  ApiResponse,
  SeasonRace,
  DriverStanding,
  TeamStanding,
  RoundDetails,
  RaceResult,
  DriverProfile,
  CircuitProfile,
  TeamProfile,
} from '../types/f1'

const API_URL = process.env.BASE_URL || 'http://localhost:3001'

export async function getSeasons(): Promise<number[]> {
  const res = await fetch(`${API_URL}/seasons`, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error('Failed to fetch seasons')
  const json: ApiResponse<number[]> = await res.json()
  return json.data
}

export async function getSeasonRaces(
  year: string,
): Promise<{ year: number; races: SeasonRace[] }> {
  const res = await fetch(`${API_URL}/seasons/${year}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Failed to fetch races for year ${year}`)
  const json: ApiResponse<{ year: number; races: SeasonRace[] }> =
    await res.json()
  return json.data
}

export async function getDriverStandings(
  year: string,
): Promise<{ year: number; standings: DriverStanding[] }> {
  const res = await fetch(`${API_URL}/standings/drivers/${year}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok)
    throw new Error(`Failed to fetch driver standings for year ${year}`)
  const json: ApiResponse<{ year: number; standings: DriverStanding[] }> =
    await res.json()
  return json.data
}

export async function getTeamStandings(
  year: string,
): Promise<{ year: number; standings: TeamStanding[] }> {
  const res = await fetch(`${API_URL}/standings/teams/${year}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok)
    throw new Error(`Failed to fetch team standings for year ${year}`)
  const json: ApiResponse<{ year: number; standings: TeamStanding[] }> =
    await res.json()
  return json.data
}

export async function getRoundDetails(roundId: string): Promise<RoundDetails> {
  const res = await fetch(`${API_URL}/races/${roundId}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok)
    throw new Error(`Failed to fetch round details for ID ${roundId}`)
  const json: ApiResponse<RoundDetails> = await res.json()
  return json.data
}

export async function getRaceResults(
  roundId: string,
): Promise<{ roundId: number; results: RaceResult[] }> {
  const res = await fetch(`${API_URL}/races/${roundId}/results`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok)
    throw new Error(`Failed to fetch race results for round ${roundId}`)
  const json: ApiResponse<{ roundId: number; results: RaceResult[] }> =
    await res.json()
  return json.data
}

export async function getDriverDetails(
  driverId: string,
  page: number = 1,
  sort?: string,
  order?: string,
): Promise<DriverProfile> {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  if (sort) params.append('sort', sort)
  if (order) params.append('order', order)

  const res = await fetch(
    `${API_URL}/drivers/${driverId}?${params.toString()}`,
    {
      next: { revalidate: 3600 },
    },
  )

  if (!res.ok) throw new Error('Failed to fetch driver details')
  const json: ApiResponse<DriverProfile> = await res.json()
  return json.data
}

export async function getCircuitDetails(
  circuitId: string,
  page: number = 1,
  sort?: string,
  order?: string,
): Promise<any> {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  if (sort) params.append('sort', sort)
  if (order) params.append('order', order)
  const res = await fetch(
    `${API_URL}/circuits/${circuitId}?${params.toString()}`,
    { next: { revalidate: 3600 } },
  )
  if (!res.ok) throw new Error('Failed to fetch circuit details')
  return (await res.json()).data
}

export async function getTeamDetails(
  teamId: string,
  page: number = 1,
  sort?: string,
  order?: string,
): Promise<any> {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  if (sort) params.append('sort', sort)
  if (order) params.append('order', order)
  const res = await fetch(`${API_URL}/teams/${teamId}?${params.toString()}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error('Failed to fetch team details')
  return (await res.json()).data
}

export async function getStats() {
  const res = await fetch(`${API_URL}/stats`, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error('Failed to fetch fun stats')
  const json = await res.json()
  return json.data
}
