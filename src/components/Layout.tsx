import { NavLink } from 'react-router-dom'
import './Layout.css'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/history', label: 'Travel History' },
  { to: '/upcoming', label: 'Upcoming Travel' },
]

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img className="brand-logo" src="/shree-icon.svg" alt="Shree Travel" />
          <div>
            <span className="brand-title">Shree Travel</span>
            <span className="brand-subtitle">By Rahul</span>
          </div>
        </div>
        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className="nav-link">
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="content">{children}</main>
      <footer className="footer">
        <span>Reporting view for travel billing operations</span>
      </footer>
    </div>
  )
}

export default Layout
