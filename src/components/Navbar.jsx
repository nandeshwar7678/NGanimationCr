
import { NavLink, useLocation } from 'react-router-dom'
import { Home as HomeIcon } from 'lucide-react'
import logo from '../assets/logo.png'
import InteractiveBrandText from './InteractiveBrandText'

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/blog', label: 'Blog' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const location = useLocation()
  const isPaymentPage = location.search.includes('type=payment')

  const getLinkClass = (to) => {
    const isActive =
      to === '/'
        ? location.pathname === '/'
        : location.pathname === to

    const active = isActive && !(to === '/contact' && isPaymentPage)

    return active
      ? 'text-white font-semibold'
      : 'text-white/70 hover:text-white'
  }

  return (
    <header className="sticky top-0 z-50 bg-base/95 backdrop-blur-md border-b border-white/10">

      {/* ================================== */}
      {/* DESKTOP NAVBAR */}
      {/* Laptop layout remains horizontal */}
      {/* ================================== */}

      <div className="hidden lg:flex container-x items-center justify-between h-16">

        <NavLink
          to="/"
          className="flex items-center gap-2 font-display font-bold text-lg"
        >
          <img
            src={logo}
            alt="NGanimationCr logo"
            className="h-8 w-8 object-contain"
          />

          <InteractiveBrandText />
        </NavLink>

        <nav className="flex items-center gap-7 text-sm text-white/70">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={() =>
                `${getLinkClass(link.to)} transition-colors`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/contact?type=payment"
          className="btn-primary payment-desktop-only shrink-0"
        >
          Form
        </NavLink>

      </div>

      {/* ================================== */}
      {/* MOBILE TOP STRIP */}
      {/* Logo + Payment Form */}
      {/* ================================== */}

      <div className="lg:hidden flex items-center justify-between gap-3 px-3 sm:px-4 h-14 border-b border-white/10">

        <NavLink
          to="/"
          aria-label="NGanimationCr Home"
          className="flex items-center gap-2 min-w-0"
        >
          <img
            src={logo}
            alt="NGanimationCr logo"
            className="h-8 w-8 object-contain shrink-0"
          />

          <span className="font-display font-bold text-sm sm:text-base whitespace-nowrap">
            <InteractiveBrandText />
          </span>
        </NavLink>

        <NavLink
          to="/contact?type=payment"
          className="btn-primary shrink-0 text-xs sm:text-sm px-3 sm:px-4 py-2"
        >
          Payment Form
        </NavLink>

      </div>

      {/* ================================== */}
      {/* MOBILE NAVIGATION STRIP */}
      {/* Horizontal scroll like reference */}
      {/* ================================== */}

      <nav
        aria-label="Mobile navigation"
        className="lg:hidden overflow-x-auto whitespace-nowrap border-b border-white/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex items-center gap-5 sm:gap-6 px-4 min-w-max h-12 text-sm">

       
{links.map((link) => (
  <NavLink
    key={link.to}
    to={link.to}
    aria-label={link.to === '/' ? 'Home' : link.label}
    className={() =>
      `relative inline-flex items-center gap-1.5 h-full shrink-0 transition-colors ${getLinkClass(link.to)}`
    }
  >
    {link.to === '/' ? (
      <HomeIcon size={19} strokeWidth={2} />
    ) : (
      link.label
    )}

    {(
      link.to === '/'
        ? location.pathname === '/'
        : location.pathname === link.to
    ) &&
      !(link.to === '/contact' && isPaymentPage) && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent" />
      )}
  </NavLink>
))}


        </div>
      </nav>

    </header>
  )
}
