
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

  const isPaymentPage =
    new URLSearchParams(location.search).get('type') === 'payment'

  const isActive = (to) => {
    if (to === '/') {
      return location.pathname === '/'
    }

    return location.pathname === to
  }

  const getLinkClass = (to) => {
    const active =
      isActive(to) && !(to === '/contact' && isPaymentPage)

    return active
      ? 'font-semibold text-white'
      : 'text-white/60 hover:text-white'
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080811]/90 text-white shadow-lg shadow-black/10 backdrop-blur-2xl">

      {/* Desktop Navbar */}
      <div className="container-x hidden h-[76px] items-center justify-between gap-8 lg:flex">

        {/* Brand */}
        <NavLink
          to="/"
          aria-label="NGanimationCr Home"
          className="flex shrink-0 items-center gap-2.5"
        >
          <img
            src={logo}
            alt="NGanimationCr Logo"
            className="h-9 w-9 object-contain"
          />

          <span className="font-display text-lg font-bold tracking-tight">
            <InteractiveBrandText />
          </span>
        </NavLink>

        {/* Desktop Links */}
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-5 xl:gap-7"
        >
          {links.map((link) => {
            const active =
              isActive(link.to) &&
              !(link.to === '/contact' && isPaymentPage)

            return (
              <NavLink
                key={link.to}
                to={link.to}
                aria-current={active ? 'page' : undefined}
                className={() =>
                  `relative flex h-[76px] shrink-0 items-center text-sm transition-colors duration-200 ${getLinkClass(link.to)}`
                }
              >
                {link.label}

                {active && (
                  <span className="absolute inset-x-0 bottom-[17px] h-0.5 rounded-full bg-gradient-to-r from-violet-400 to-sky-400" />
                )}
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Mobile Brand Row */}
      <div className="flex h-[62px] items-center px-4 sm:h-[68px] sm:px-5 lg:hidden">
        <NavLink
          to="/"
          aria-label="NGanimationCr Home"
          className="flex min-w-0 items-center gap-2"
        >
          <img
            src={logo}
            alt="NGanimationCr Logo"
            className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9"
          />

          <span className="truncate font-display text-sm font-bold tracking-tight sm:text-base">
            <InteractiveBrandText />
          </span>
        </NavLink>
      </div>

      {/* Single Mobile Navigation Row */}
      <nav
        aria-label="Mobile navigation"
        className="overflow-x-auto whitespace-nowrap border-t border-white/[0.06] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden"
      >
        <div className="flex h-11 min-w-max items-center gap-6 px-4 sm:h-12 sm:gap-7 sm:px-5">
          {links.map((link) => {
            const active =
              isActive(link.to) &&
              !(link.to === '/contact' && isPaymentPage)

            return (
              <NavLink
                key={link.to}
                to={link.to}
                aria-label={link.to === '/' ? 'Home' : link.label}
                aria-current={active ? 'page' : undefined}
                className={() =>
                  `relative flex h-full shrink-0 items-center text-sm transition-colors duration-200 ${getLinkClass(link.to)}`
                }
              >
                {link.to === '/' ? (
                  <HomeIcon size={19} strokeWidth={2} />
                ) : (
                  link.label
                )}

                {active && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-violet-400 to-sky-400" />
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
