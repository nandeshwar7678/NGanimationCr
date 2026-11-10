
import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Home as HomeIcon,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  UserRound,
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
  const profileRef = useRef(null)

  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const isAdmin =
    String(user?.role || '').toLowerCase() === 'admin'

  const isStudent =
    String(user?.role || '').toLowerCase() === 'student'

  const isPaymentPage =
    new URLSearchParams(location.search).get('type') === 'payment'

  // Verify current login session
  useEffect(() => {
    let isMounted = true

    const checkUser = async () => {
      try {
        const response = await fetch('/api/auth/me.php', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        })

        const data = await response.json()

        if (!isMounted) return

        if (response.ok && data.success && data.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Session check error:', error)

        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false)
        }
      }
    }

    setAuthLoading(true)
    setProfileOpen(false)
    checkUser()

    return () => {
      isMounted = false
    }
  }, [location.pathname, location.search])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname === to
  }

  const getLinkClass = (to) => {
    const active =
      isActive(to) && !(to === '/contact' && isPaymentPage)

    return active
      ? 'font-semibold text-white'
      : 'text-white/60 hover:text-white'
  }

  // Logout
  const handleLogout = async () => {
    if (loggingOut) return

    setLoggingOut(true)

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

      navigate('/', { replace: true })
    } catch (error) {
      alert(error.message || 'Unable to logout')
    } finally {
      setLoggingOut(false)
    }
  }

  const initials =
    user?.name?.trim()?.charAt(0)?.toUpperCase() || 'U'

  return (
    <header
      ref={profileRef}
      className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080811]/90 text-white shadow-lg shadow-black/10 backdrop-blur-2xl"
    >
      {/* Main Navbar */}
      <div className="container-x flex min-h-[68px] items-center justify-between gap-4 px-4 sm:px-5 lg:h-[76px]">

        {/* Logo */}
        <NavLink
          to="/"
          aria-label="NGanimationCr Home"
          className="flex min-w-0 shrink-0 items-center gap-2.5"
        >
          <img
            src={logo}
            alt="NGanimationCr Logo"
            className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9"
          />

          <span className="truncate font-display text-sm font-bold tracking-tight sm:text-base lg:text-lg">
            <InteractiveBrandText />
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-4 xl:gap-6 lg:flex"
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

        {/* Single Account Menu - Desktop and Mobile */}
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
                onClick={() => setProfileOpen((prev) => !prev)}
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
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <UserRound size={18} />
                      My Profile
                    </NavLink>

                    {isStudent && (
                      <NavLink
                        to="/my-learning"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                      >
                        <GraduationCap size={18} />
                        My Learning
                      </NavLink>
                    )}

                    {isAdmin && (
                      <NavLink
                        to="/admin/dashboard"
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
                      disabled={loggingOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <LogOut size={18} />
                      {loggingOut ? 'Logging out...' : 'Logout'}
                    </button>

                  </div>
                </div>
              )}
            </>
          )}

          {authLoading && (
            <div className="h-9 w-9 animate-pulse rounded-full bg-white/10" />
          )}

        </div>
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
