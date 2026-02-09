export type TravelStatus = 'completed' | 'cancelled' | 'no-show'

export interface TravelTrip {
  id: string
  tripCode: string
  customerName: string
  driverName: string
  carType: string
  distanceKm: number
  ratePerKm: number
  advancePayment: number
  startedAt: string
  endedAt: string
  status: TravelStatus
}

export interface UpcomingTrip {
  id: string
  customerName: string
  driverName: string
  carType: string
  distanceKm: number
  ratePerKm: number
  advancePayment: number
  pickupAt: string
  notes?: string
}

export function calculateFare(distanceKm: number, ratePerKm: number) {
  return distanceKm * ratePerKm
}

const historySeed: TravelTrip[] = []

const upcomingSeed: UpcomingTrip[] = []

const HISTORY_KEY = 'shree_travels_history'
const UPCOMING_KEY = 'shree_travels_upcoming'

export function loadHistory(): TravelTrip[] {
  if (typeof window === 'undefined') return historySeed
  const raw = window.localStorage.getItem(HISTORY_KEY)
  if (!raw) return historySeed
  try {
    const parsed = JSON.parse(raw) as TravelTrip[]
    return parsed.map((trip) => ({
      ...trip,
      advancePayment: Number(trip.advancePayment) || 0,
    }))
  } catch {
    return historySeed
  }
}

export function saveHistory(trips: TravelTrip[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(trips))
}

export function loadUpcomingTrips(): UpcomingTrip[] {
  if (typeof window === 'undefined') return upcomingSeed
  const raw = window.localStorage.getItem(UPCOMING_KEY)
  if (!raw) return upcomingSeed
  try {
    const parsed = JSON.parse(raw) as UpcomingTrip[]
    return parsed.map((trip) => ({
      ...trip,
      advancePayment: Number(trip.advancePayment) || 0,
    }))
  } catch {
    return upcomingSeed
  }
}

export function saveUpcomingTrips(trips: UpcomingTrip[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(UPCOMING_KEY, JSON.stringify(trips))
}
