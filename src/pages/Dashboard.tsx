import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import {
  calculateFare,
  loadHistory,
  loadUpcomingTrips,
  type TravelTrip,
  type UpcomingTrip,
} from '../data/travel'
import './Dashboard.css'

const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

function formatCurrency(value: number) {
  return rupeeFormatter.format(value)
}

function Dashboard() {
  const [history, setHistory] = useState<TravelTrip[]>([])
  const [upcoming, setUpcoming] = useState<UpcomingTrip[]>([])

  useEffect(() => {
    // TODO: Replace with API aggregation endpoints or client-side derived data.
    setHistory(loadHistory())
    setUpcoming(loadUpcomingTrips())
  }, [])

  const totalTrips = history.length
  const totalDistance = history.reduce((sum, trip) => sum + trip.distanceKm, 0)
  const totalRevenue = history.reduce(
    (sum, trip) => sum + calculateFare(trip.distanceKm, trip.ratePerKm),
    0,
  )
  const averageFare = totalTrips ? totalRevenue / totalTrips : 0

  return (
    <div className="dashboard">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Today overview</p>
          <h1>Shree Travels billing dashboard</h1>
          <p className="subtitle">
            Track completed rides, revenue totals, and upcoming travel entries in
            one view.
          </p>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard label="Completed Trips" value={String(totalTrips)} />
        <StatCard
          label="Total Distance"
          value={`${totalDistance.toFixed(1)} km`}
        />
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} />
        <StatCard
          label="Average Fare"
          value={formatCurrency(averageFare)}
          helper="Per completed trip"
        />
      </section>

      <section className="panel-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Recent travel history</h2>
            <span className="panel-chip">Last 5 trips</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Trip</th>
                  <th>Customer</th>
                  <th>Driver</th>
                  <th>Car</th>
                  <th>Distance</th>
                  <th>Fare</th>
                </tr>
              </thead>
              <tbody>
                {history.map((trip) => (
                  <tr key={trip.id}>
                    <td>{trip.tripCode}</td>
                    <td>{trip.customerName}</td>
                    <td>{trip.driverName}</td>
                    <td>{trip.carType}</td>
                    <td>{trip.distanceKm.toFixed(1)} km</td>
                    <td>
                      {formatCurrency(
                        calculateFare(trip.distanceKm, trip.ratePerKm),
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Upcoming travel entries</h2>
            <span className="panel-chip">Next 72 hours</span>
          </div>
          <div className="upcoming-list">
            {upcoming.map((trip) => (
              <div className="upcoming-card" key={trip.id}>
                <div>
                  <p className="upcoming-title">{trip.customerName}</p>
                  <p className="upcoming-meta">
                    Driver: {trip.driverName} · {trip.carType}
                  </p>
                </div>
                <div className="upcoming-right">
                  <span>{trip.distanceKm.toFixed(1)} km</span>
                  <span>
                    {formatCurrency(
                      calculateFare(trip.distanceKm, trip.ratePerKm),
                    )}
                  </span>
                  <span className="upcoming-time">
                    {new Date(trip.pickupAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
