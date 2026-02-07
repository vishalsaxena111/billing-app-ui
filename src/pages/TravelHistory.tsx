import { useEffect, useState } from 'react'
import { calculateFare, loadHistory, type TravelTrip } from '../data/travel'
import './TravelHistory.css'

const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

function formatCurrency(value: number) {
  return rupeeFormatter.format(value)
}

function TravelHistory() {
  const [history, setHistory] = useState<TravelTrip[]>([])

  useEffect(() => {
    // TODO: Replace with API data and filters (ex: GET /api/trips?dateFrom=...).
    setHistory(loadHistory())
  }, [])

  const totalDistance = history.reduce((sum, trip) => sum + trip.distanceKm, 0)
  const totalRevenue = history.reduce(
    (sum, trip) => sum + calculateFare(trip.distanceKm, trip.ratePerKm),
    0,
  )

  return (
    <div className="history-page">
      <header className="page-header">
        <div>
          <h1>Travel history</h1>
          <p>All completed travel records for billing reconciliation.</p>
        </div>
        <div className="summary">
          <div>
            <span>Total distance</span>
            <strong>{totalDistance.toFixed(1)} km</strong>
          </div>
          <div>
            <span>Total revenue</span>
            <strong>{formatCurrency(totalRevenue)}</strong>
          </div>
        </div>
      </header>

      <div className="history-table">
        <table>
          <thead>
            <tr>
              <th>Trip Code</th>
              <th>Customer</th>
              <th>Driver</th>
              <th>Car Type</th>
              <th>Distance</th>
              <th>Total Fare</th>
              <th>Status</th>
              <th>Start</th>
              <th>End</th>
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
                <td className={`status ${trip.status}`}>{trip.status}</td>
                <td>{new Date(trip.startedAt).toLocaleString()}</td>
                <td>{new Date(trip.endedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TravelHistory
