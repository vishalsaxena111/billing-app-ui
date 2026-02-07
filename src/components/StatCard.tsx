import './StatCard.css'

interface StatCardProps {
  label: string
  value: string
  helper?: string
}

function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {helper ? <span className="stat-helper">{helper}</span> : null}
    </div>
  )
}

export default StatCard
