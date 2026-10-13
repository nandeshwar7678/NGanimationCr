
import { NavLink } from 'react-router-dom'
import {
  Check,
  Sparkles,
  ArrowRight,
  Crown,
  Zap,
  Clapperboard,
  ShieldCheck,
} from 'lucide-react'

const plans = [
  {
    name: 'Basic',
    price: '₹2,500',
    desc: 'Perfect for a single creative project.',
    icon: Zap,
    features: [
      '1 Video (up to 50 sec)',
      'Professional Basic Editing',
      'HD Video Output',
      '1 Revision Included',
    ],
  },
  {
    name: 'Standard',
    price: '₹10,000',
    desc: 'Our recommended creative package.',
    icon: Sparkles,
    popular: true,
    features: [
      '5 Videos (up to 1 min each)',
      'Advanced Video Editing',
      'HD + 4K Output',
      '3 Revisions Included',
    ],
  },
  {
    name: 'Premium',
    price: '₹25,000',
    desc: 'Premium creativity for growing brands.',
    icon: Crown,
    features: [
      '5+ Videos (up to 2 min each)',
      'Full Animation & Storytelling',
      '4K Professional Output',
      'Revision Terms on Agreement',
    ],
  },
]

export default function Pricing() {
  return (
    <section className="relative isolate overflow-hidden py-3 sm:py-4 lg:py-5">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#100c20] via-[#09090f] to-[#09090f]" />

        <div className="absolute -top-32 left-1/2 h-64 w-[520px] max-w-full -translate-x-1/2 rounded-full bg-violet-600/15 blur-[100px]" />

        <div className="absolute left-0 top-1/3 h-48 w-48 rounded-full bg-indigo-600/[0.07] blur-[85px]" />

        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-fuchsia-600/[0.06] blur-[85px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container-x relative">
        {/* HEADER */}
        <header className="mx-auto mb-5 max-w-3xl text-center sm:mb-6">
          {/* <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.08] px-3 py-1.5 text-[10px] font-semibold tracking-wider text-violet-200 sm:text-[11px]">
            <Sparkles size={13} />
            PREMIUM CREATIVE SOLUTIONS
          </div> */}

          <h1 className="text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-[44px]">
            Invest in Your
            <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300 bg-clip-text pb-1 text-transparent">
              Creative Vision.
            </span>
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-white/50 sm:text-sm">
            Professional AI video ads, animation and creative content
            packages designed to bring your brand story to life.
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[10px] text-white/55 sm:gap-x-6 sm:text-xs">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-violet-300" />
              Professional Quality
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Clapperboard size={13} className="text-violet-300" />
              Creative Storytelling
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Check size={13} className="text-violet-300" />
              Clear Package Pricing
            </span>
          </div>
        </header>

        {/* PRICING CARDS */}
        <div className="grid items-stretch gap-4 md:grid-cols-3 lg:gap-5">
          {plans.map((p) => {
            const Icon = p.icon

            return (
              <article
                key={p.name}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border p-4 transition-all duration-300 sm:p-5 ${
                  p.popular
                    ? 'border-violet-400/60 bg-gradient-to-b from-violet-500/[0.15] via-[#171322] to-[#100f18] shadow-[0_0_35px_rgba(139,92,246,0.12)]'
                    : 'border-white/[0.09] bg-white/[0.025] hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/[0.045] hover:shadow-[0_15px_40px_rgba(109,93,246,0.12)]'
                }`}
              >
                {/* CARD GLOW */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-violet-500/10 opacity-0 blur-[60px] transition-opacity duration-300 group-hover:opacity-100" />

                {p.popular && (
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent" />
                )}

                <div className="relative flex flex-1 flex-col">
                  {/* PLAN NAME */}
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <div
                        className={`mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110 ${
                          p.popular
                            ? 'border-violet-300/30 bg-violet-400/15 text-violet-200'
                            : 'border-white/10 bg-white/[0.05] text-white/75'
                        }`}
                      >
                        <Icon size={20} />
                      </div>

                      <h2 className="text-lg font-semibold text-white transition-colors group-hover:text-violet-200 sm:text-xl">
                        {p.name}
                      </h2>

                      <p className="mt-1 text-xs leading-5 text-white/45">
                        {p.desc}
                      </p>
                    </div>

                    {p.popular && (
                      <span className="mt-1 shrink-0 rounded-full border border-violet-300/25 bg-violet-300/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-violet-200 sm:text-[10px]">
                        Popular
                      </span>
                    )}
                  </div>

                  {/* PRICE */}
                  <div className="mb-3">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        {p.price}
                      </span>

                      <span className="text-[11px] text-white/35">
                        / package
                      </span>
                    </div>
                  </div>

                  <div className="mb-3 h-px bg-gradient-to-r from-white/15 via-white/[0.06] to-transparent" />

                  {/* FEATURES */}
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                    What's included
                  </p>

                  <ul className="mb-4 flex-1 space-y-2.5">
                    {p.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-xs leading-5 text-white/65 transition-colors group-hover:text-white/85 sm:text-[13px]"
                      >
                        <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-violet-400/10 text-violet-300">
                          <Check size={11} strokeWidth={2.5} />
                        </span>

                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* BUTTON */}
                  <NavLink
                    to={`/contact?type=${encodeURIComponent(
                      p.name.toLowerCase()
                    )}`}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 sm:text-sm ${
                      p.popular
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_6px_20px_rgba(109,93,246,0.22)] hover:brightness-110 hover:shadow-[0_8px_25px_rgba(109,93,246,0.35)]'
                        : 'border border-white/10 bg-white/[0.04] text-white hover:border-violet-400/40 hover:bg-violet-500/10'
                    }`}
                  >
                    Choose {p.name}

                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </NavLink>
                </div>
              </article>
            )
          })}
        </div>

        {/* CUSTOM PACKAGE - BELOW PRICING */}
        <div className="group relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#171323] via-[#12111b] to-[#171020] p-5 sm:mt-8 sm:p-6">
          <div className="pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full bg-violet-500/10 blur-[70px] transition-colors group-hover:bg-violet-500/20" />

          <div className="relative flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div className="flex flex-col items-center gap-3 sm:flex-row md:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-violet-200">
                <Sparkles size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white sm:text-xl">
                  Need a Custom Package?
                </h2>

                <p className="mt-1 max-w-xl text-xs leading-5 text-white/50 sm:text-sm">
                  Tell us your vision. We'll create a package tailored
                  to your brand, campaign and creative goals.
                </p>
              </div>
            </div>

            <NavLink
              to="/contact?type=custom"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-semibold text-[#111018] transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-100 hover:shadow-[0_8px_25px_rgba(139,92,246,0.2)] sm:text-sm"
            >
              Get a Custom Quote
              <ArrowRight size={15} />
            </NavLink>
          </div>
        </div>

        {/* FOOTER */}
        <p className="mt-4 text-center text-[10px] text-white/80 sm:text-xs">
          ✦ Every brand has a story. Let's tell yours with NGanimationCr.
        </p>
      </div>
    </section>
  )
}
