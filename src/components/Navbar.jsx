import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, Sparkles } from 'lucide-react'
import logo from '../assets/logo.png'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  // { to: '/videos', label: 'Videos' },
  { to: '/blog', label: 'Blog' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-base/80 backdrop-blur-md border-b border-white/5">
      <div className="container-x flex items-center justify-between h-16">
        <NavLink to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <img src={logo} alt="NGanimationCr logo" className="h-8 w-8 object-contain" />
          NGanimationCr
        </NavLink>

        <nav className="hidden lg:flex items-center gap-7 text-sm text-white/70">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `hover:text-white transition-colors ${isActive && !(l.to === '/contact' && window.location.search.includes('type=payment'))
                  ? 'text-white'
                  : ''
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

 <NavLink
  to="/contact?type=payment"
  className="btn-primary payment-desktop-only"
>
  Payment Form
</NavLink>

        <button className="lg:hidden text-white" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/5 bg-base px-5 pb-5 pt-2 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `py-2.5 text-sm border-b border-white/5 ${isActive && !(l.to === '/contact' && window.location.search.includes('type=payment'))
                  ? 'text-white'
                  : 'text-white/70'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/contact?type=payment"
            onClick={() => setOpen(false)}
            className="btn-primary justify-center mt-3"
          >
            Payment Form
          </NavLink>
        </div>
      )}
    </header>
  )
}
