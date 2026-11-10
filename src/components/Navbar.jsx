
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Home as HomeIcon,
  UserRound,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
} from 'lucide-react'

import logo from '../assets/logo.png'
import InteractiveBrandText from './InteractiveBrandText'

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/courses', label: 'Courses' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/blog', label: 'Blog' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)

  const isPaymentPage =
    new URLSearchParams(location.search).get('type') === 'payment'

  // Check logged-in user
  useEffect(() => {
    let isMounted = true

    const checkUser = async () => {
      try {
        const response = await fetch('/api/auth/me.php', {
          credentials: 'include',
        })

        const data = await response.json()

        if (isMounted) {
          setUser(
            response.ok && data.success && data.user
              ? data.user
              : null
          )
        }
      } catch (error) {
        console.error('User verification failed:', error)

        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false)
        }
      }
    }

    checkUser()
    setProfileOpen(false)

    return () => {
      isMounted = false
    }
  }, [location.pathname, location.search])

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

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout.php', {
        method: 'POST',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Logout failed')
      }

      setUser(null)
      setProfileOpen(false)
      navigate('/')
    } catch (error) {
      alert(error.message || 'Unable to logout')
    }
  }

  const initials = user?.name?.trim()?.charAt(0)?.toUpperCase() || 'U'

  // Account section shared by desktop and mobile
  const accountMenu = (
    <div className="relative flex shrink-0 items-center gap-3">

      {!authLoading && !user && (
        <>
          <NavLink
            to="/login"
            className="text-sm font-medium text-white/80 transition hover:text-white"
          >
            Login
          </NavLink>

          <NavLink
            to="/register"
            className="rounded-full bg-gradient-to-r from-violet-600 to-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Register
          </NavLink>
        </>
      )}

      {!authLoading && user && (
        <>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
            aria-label="Open profile menu"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] p-1.5 pr-3 transition hover:border-violet-400/50 hover:bg-white/10"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-sky-500 text-sm font-bold text-white">
              {initials}
            </span>

            <span className="hidden max-w-[110px] truncate text-sm font-medium text-white sm:block">
              {user.name}
            </span>

            <ChevronDown
              size={15}
              className={`text-white/60 transition-transform ${
                profileOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full z-[100] mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#171722] shadow-2xl shadow-black/50">

              <div className="border-b border-white/10 px-4 py-4">
                <p className="truncate text-sm font-semibold text-white">
                  {user.name}
                </p>

                <p className="mt-1 truncate text-xs text-gray-400">
                  {user.email}
                </p>

                <span className="mt-2 inline-block rounded-full bg-violet-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                  {user.role}
                </span>
              </div>

              <div className="p-2">

                <NavLink
                  to="/my-learning"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                  <GraduationCap size={18} />
                  My Learning
                </NavLink>

                {user.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-violet-300 transition hover:bg-violet-500/10 hover:text-violet-200"
                  >
                    <LayoutDashboard size={18} />
                    Admin Dashboard
                  </NavLink>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </div>
            </div>
          )}
        </>
      )}
    </div>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080811]/90 text-white shadow-lg shadow-black/10 backdrop-blur-2xl">

      {/* Desktop Navbar */}
      <div className="container-x hidden h-[76px] items-center justify-between gap-6 lg:flex">

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

        <nav
          aria-label="Main navigation"
          className="flex items-center gap-4 xl:gap-6"
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

        {accountMenu}
      </div>

      {/* Mobile Brand Row */}
      <div className="flex h-[62px] items-center justify-between gap-3 px-4 sm:h-[68px] sm:px-5 lg:hidden">

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

        {accountMenu}
      </div>

      {/* Mobile Navigation */}
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
