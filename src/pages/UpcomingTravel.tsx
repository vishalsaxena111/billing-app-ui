import { useEffect, useMemo, useState } from 'react'
import {
  calculateFare,
  loadHistory,
  loadUpcomingTrips,
  saveHistory,
  saveUpcomingTrips,
  type UpcomingTrip,
  type TravelTrip,
} from '../data/travel'
import './UpcomingTravel.css'

const emptyForm = {
  customerName: '',
  driverName: '',
  carType: '',
  distanceKm: '',
  ratePerKm: '',
  advancePayment: '',
  pickupAt: '',
  notes: '',
}

const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

function formatCurrency(value: number) {
  return rupeeFormatter.format(value)
}

function UpcomingTravel() {
  // TODO: Replace local storage with API data (ex: GET /api/upcoming-trips).
  const [trips, setTrips] = useState<UpcomingTrip[]>([])
  const [history, setHistory] = useState<TravelTrip[]>([])
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    setTrips(loadUpcomingTrips())
    setHistory(loadHistory())
  }, [])

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const calculatedFare = useMemo(() => {
    const distance = Number(form.distanceKm)
    const rate = Number(form.ratePerKm)
    if (!distance || !rate) return 0
    return calculateFare(distance, rate)
  }, [form.distanceKm, form.ratePerKm])

  const calculatedBalance = useMemo(() => {
    const advance = Number(form.advancePayment) || 0
    return Math.max(calculatedFare - advance, 0)
  }, [calculatedFare, form.advancePayment])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const distanceKm = Number(form.distanceKm)
    const ratePerKm = Number(form.ratePerKm)
    const totalFare = calculateFare(distanceKm, ratePerKm)
    const advancePayment = Math.min(
      Math.max(Number(form.advancePayment) || 0, 0),
      totalFare,
    )

    const nextTrip: UpcomingTrip = {
      id: `up-${Date.now()}`,
      customerName: form.customerName.trim(),
      driverName: form.driverName.trim(),
      carType: form.carType.trim(),
      distanceKm,
      ratePerKm,
      advancePayment,
      pickupAt: form.pickupAt,
      notes: form.notes.trim() || undefined,
    }

    // TODO: Send to API (ex: POST /api/upcoming-trips) before updating local state.
    const nextTrips = [nextTrip, ...trips]
    setTrips(nextTrips)
    saveUpcomingTrips(nextTrips)
    setForm(emptyForm)
  }

  function handleComplete(trip: UpcomingTrip) {
    const completedTrip: TravelTrip = {
      id: `hist-${Date.now()}`,
      tripCode: `TRV-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: trip.customerName,
      driverName: trip.driverName,
      carType: trip.carType,
      distanceKm: trip.distanceKm,
      ratePerKm: trip.ratePerKm,
      advancePayment: trip.advancePayment,
      startedAt: trip.pickupAt,
      endedAt: new Date().toISOString(),
      status: 'completed',
    }

    const nextHistory = [completedTrip, ...history]
    const nextUpcoming = trips.filter((item) => item.id !== trip.id)

    setHistory(nextHistory)
    setTrips(nextUpcoming)
    saveHistory(nextHistory)
    saveUpcomingTrips(nextUpcoming)
  }

  return (
    <div className="upcoming-page">
      <header className="upcoming-header">
        <div>
          <h1>Upcoming travel entries</h1>
          <p>Create a new scheduled travel entry for billing preparation.</p>
        </div>
      </header>

      <section className="form-panel">
        <h2>Create entry</h2>
        <form onSubmit={handleSubmit} className="entry-form">
          <label>
            Customer name
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Customer name"
              required
            />
          </label>
          <label>
            Driver name
            <input
              name="driverName"
              value={form.driverName}
              onChange={handleChange}
              placeholder="Driver name"
              required
            />
          </label>
          <label>
            Car type
            <input
              name="carType"
              value={form.carType}
              onChange={handleChange}
              placeholder="SUV, Sedan, Compact"
              required
            />
          </label>
          <label>
            Distance (km)
            <input
              name="distanceKm"
              type="number"
              step="0.1"
              value={form.distanceKm}
              onChange={handleChange}
              placeholder="0.0"
              required
            />
          </label>
          <label>
            Rate (Rs / km)
            <input
              name="ratePerKm"
              type="number"
              step="1"
              value={form.ratePerKm}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </label>
          <label>
            Total fare (auto)
            <input value={formatCurrency(calculatedFare)} readOnly />
          </label>
          <label>
            Advance payment (Rs)
            <input
              name="advancePayment"
              type="number"
              min="0"
              step="1"
              value={form.advancePayment}
              onChange={handleChange}
              placeholder="0"
            />
          </label>
          <label>
            Balance due (auto)
            <input value={formatCurrency(calculatedBalance)} readOnly />
          </label>
          <label>
            Pickup time
            <input
              name="pickupAt"
              type="datetime-local"
              value={form.pickupAt}
              onChange={handleChange}
              required
            />
          </label>
          <label className="notes">
            Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Extra instructions"
              rows={3}
            />
          </label>
          <button type="submit">Save upcoming trip</button>
        </form>
      </section>

      <section className="list-panel">
        <div className="list-header">
          <h2>Scheduled trips</h2>
          <span>{trips.length} entries</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
                <tr>
                  <th>Customer</th>
                  <th>Driver</th>
                  <th>Car type</th>
                  <th>Distance</th>
                  <th>Rate</th>
                  <th>Total fare</th>
                  <th>Advance</th>
                  <th>Balance</th>
                  <th>Pickup time</th>
                  <th>Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip.id}>
                    <td>{trip.customerName}</td>
                    <td>{trip.driverName}</td>
                    <td>{trip.carType}</td>
                    <td>{trip.distanceKm.toFixed(1)} km</td>
                    <td>{formatCurrency(trip.ratePerKm)}</td>
                    <td>
                      {formatCurrency(
                        calculateFare(trip.distanceKm, trip.ratePerKm),
                      )}
                    </td>
                    <td>{formatCurrency(trip.advancePayment)}</td>
                    <td>
                      {formatCurrency(
                        Math.max(
                          calculateFare(trip.distanceKm, trip.ratePerKm) -
                            trip.advancePayment,
                          0,
                        ),
                      )}
                    </td>
                    <td>{new Date(trip.pickupAt).toLocaleString()}</td>
                    <td>{trip.notes ?? '—'}</td>
                    <td>
                      <button
                        type="button"
                        className="complete-btn"
                        onClick={() => handleComplete(trip)}
                      >
                        Complete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default UpcomingTravel
