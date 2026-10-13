
import { NavLink } from 'react-router-dom'
import InteractiveBrandText from '../components/InteractiveBrandText'
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
  Github,
  AtSign,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  CreditCard,
} from 'lucide-react'
import logo from '../assets/logo.png'

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Our Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Blog', to: '/blog' },
  { label: 'Pricing', to: '/pricing' },
]

const services = [
  { label: 'AI Animation', slug: 'ai-animation' },
  { label: 'AI Video Creation', slug: 'ai-video-creation' },
  { label: 'Brand Advertisement', slug: 'brand-advertisement' },
  { label: 'Instagram Reels', slug: 'instagram-reels' },
  { label: 'YouTube Content', slug: 'youtube-content' },
  { label: 'Storytelling Videos', slug: 'storytelling-videos' },
]

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/NGanimationCr',
    Icon: Instagram,
    color: 'text-[#E4405F]',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@NGanimation_Cr',
    Icon: Youtube,
    color: 'text-[#FF0000]',
  },
  {
    label: 'Threads',
    href: 'https://threads.net/@NGanimationCr',
    Icon: AtSign,
    color: 'text-white',
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/NGanimationCr',
    Icon: Facebook,
    color: 'text-[#1877F2]',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/nandeshwar7678',
    Icon: Linkedin,
    color: 'text-[#0A66C2]',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/nandeshwar7678',
    Icon: Github,
    color: 'text-white',
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  const handleServiceClick = (slug) => {
    if (window.location.pathname === '/services') {
      const currentService = new URLSearchParams(
        window.location.search
      ).get('service')

      if (currentService === slug) {
        setTimeout(() => {
          document
            .getElementById(`service-${slug}`)
            ?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
        }, 0)
      }
    }
  }

  return (
    <footer className="relative mt-10 overflow-hidden border-t border-white/10 bg-[#080811] text-white">
      {/* Subtle background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/4 h-64 w-64 rounded-full bg-violet-600/[0.08] blur-[90px]"
      />

      <div className="container-x relative z-10">
        {/* Call to action */}
        <div className="flex flex-col gap-4 border-b border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
              <Sparkles size={14} />
              Have a creative idea?
            </div>

            <h2 className="text-xl font-bold leading-tight sm:text-2xl">
              Let's create something{' '}
              <span className="bg-gradient-to-r from-sky-300 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                extraordinary.
              </span>
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/50">
              AI animation, brand advertisements and creative video production.
            </p>
          </div>

          <NavLink
            to="/contact"
           className="group inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-amber-400/30 bg-gradient-to-r from-amber-300 via-yellow-0 to-amber-600 px-5 py-3 text-sm font-semibold text-black shadow-md shadow-amber-500/10 transition duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-400/20 sm:self-center"
          >
            Start a Project
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </NavLink>
        </div>

        {/* Footer columns */}
        <div className="grid grid-cols-1 gap-7 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div>
            <NavLink
              to="/"
              aria-label="NGanimationCr home"
              className="mb-3 inline-flex items-center gap-2"
            >
              <img
                src={logo}
                alt="NGanimationCr logo"
                className="h-9 w-9 shrink-0 object-contain"
              />

              <span className="text-lg font-bold">
                <InteractiveBrandText />
              </span>
            </NavLink>

            <p className="max-w-xs text-sm leading-6 text-white/50">
              Creating stories with AI. Bringing ideas to life through
              animation, storytelling and creative video production.
            </p>

            <p className="mb-3 mt-4 text-xs font-semibold uppercase tracking-wider text-white/40">
              Follow us
            </p>

            <div className="flex flex-wrap gap-2">
              {socialLinks.map(({ label, href, Icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit NGanimationCr on ${label}`}
                  title={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <Icon
                    size={17}
                    className={`${color} transition-transform hover:scale-110`}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-white">
              Explore
            </h3>

            <ul className="space-y-2.5">
              {quickLinks.map(({ label, to }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-white">
              Our Services
            </h3>

            <ul className="space-y-2.5">
              {services.map(({ label, slug }) => (
                <li key={slug}>
                  <NavLink
                    to={`/services?service=${slug}`}
                    onClick={() => handleServiceClick(slug)}
                    className="group inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
                  >
                    <span>{label}</span>
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact and Payment Portal */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-white">
              Get in Touch
            </h3>

            <p className="mb-4 text-sm leading-6 text-white/50">
              For projects, collaborations and business inquiries.
            </p>

            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:NGanimationCr@gmail.com"
                  className="flex items-start gap-3 text-sm text-white/60 transition hover:text-white"
                >
                  <Mail
                    size={17}
                    className="mt-0.5 shrink-0 text-violet-300"
                  />
                  <span className="break-all">
                    NGanimationCr@gmail.com
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="tel:+917498699607"
                  className="flex items-center gap-3 text-sm text-white/60 transition hover:text-white"
                >
                  <Phone
                    size={17}
                    className="shrink-0 text-violet-300"
                  />
                  +91 74986 99607
                </a>
              </li>

             
<li>
  <a
    href="https://www.google.com/maps/search/?api=1&query=Hinjewadi+Phase+I%2C+Shivaji+Chowk%2C+Pune%2C+Maharashtra+411057%2C+India"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Open NGanimationCr location in Google Maps"
    title="View location on Google Maps"
    className="group flex items-start gap-3 text-sm leading-6 text-white/50 transition-colors duration-300 hover:text-white"
  >
    <MapPin
      size={17}
      className="mt-1 shrink-0 text-violet-300 transition-transform duration-300 group-hover:scale-110"
    />

    <span className="underline decoration-white/0 underline-offset-4 transition-all duration-300 group-hover:decoration-violet-300">
      Hinjewadi Phase I, Shivaji Chowk,
      Pune, Maharashtra – 411057, India
      <span className="mt-1 block text-xs text-violet-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        Open in Google Maps ↗
      </span>
    </span>
  </a>
</li>

            </ul>

            <NavLink
              to="/contact"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-300 transition hover:text-white"
            >
              Contact Us
              <ArrowRight size={14} />
            </NavLink>

            {/* Payment Portal */}
            <NavLink
              to="/contact?type=payment"
              className="group mt-5 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition-all duration-300 hover:border-violet-400/30 hover:bg-violet-500/[0.08]"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-500/10 text-violet-300 transition-colors group-hover:bg-violet-500/20">
                  <CreditCard size={19} />
                </span>

                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white/90">
                    Payment Portal
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-white/45">
                    Submit your payment details
                  </span>
                </span>
              </span>

              <ArrowUpRight
                size={17}
                className="shrink-0 text-white/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-300"
              />
            </NavLink>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 py-4 text-xs text-white/40 sm:flex-row">
          <p>
            © {year} NGanimationCr. All rights reserved.
          </p>

          <a
            href="mailto:NGanimationCr@gmail.com"
            className="transition-colors hover:text-white"
          >
            Made with creativity by NGanimationCr
          </a>
        </div>
      </div>
    </footer>
  )
}
