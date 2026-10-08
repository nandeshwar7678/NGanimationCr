import { NavLink } from 'react-router-dom'
import { Check, Sparkles, ArrowRight } from 'lucide-react'

const plans = [
  {
    name: 'Basic',
    price: '₹2,500',
    desc: 'Perfect for small projects.',
    features: [
      '1 Video (up to 50 sec)',
      'Basic Editing',
      'HD Output',
      '1 Revision',
    ],
  },
  {
    name: 'Standard',
    price: '₹10,000',
    desc: 'Most popular choice.',
    popular: true,
    features: [
      '5 Videos (up to 1 min)',
      'Advanced Editing',
      'HD + 4K Output',
      '3 Revisions',
    ],
  },
  {
    name: 'Premium',
    price: '₹25,000',
    desc: 'For brands & businesses.',
    features: [
      '5+ Videos (up to 2 min)',
      'Full Animation',
      '4K + Pro Quality',
      'Unlimited Revisions',
    ],
  },
]

export default function Pricing() {
  return (
    <div className="py-10 sm:py-12">
      <div className="container-x">

        {/* ================= HEADER ================= */}
        <div className="text-center mb-8">

          <div
            className="
              inline-flex items-center gap-2
              text-xs text-accent
              bg-accent/10
              border border-accent/20
              px-3 py-1.5
              rounded-full
              mb-3
            "
          >
            <Sparkles size={13} />
            Simple & Transparent Pricing
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Choose Your{' '}
            <span className="text-accent">
              Creative Package
            </span>
          </h1>

          <p className="text-white/50 text-sm max-w-xl mx-auto">
            Professional AI animation, video creation and creative
            content packages designed to bring your ideas to life.
          </p>

        </div>


        {/* ================= PRICING CARDS ================= */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">

          {plans.map((p) => (

            <div
              key={p.name}
              className={`
                group
                relative
                card
                p-6
                flex
                flex-col
                transition-all
                duration-300
                ease-out

                hover:-translate-y-2
                hover:scale-[1.015]
                hover:border-accent/50
                hover:shadow-[0_15px_45px_rgba(109,93,246,0.20)]

                ${
                  p.popular
                    ? `
                      border-accent/60
                      shadow-[0_10px_35px_rgba(109,93,246,0.12)]
                    `
                    : 'border-white/5'
                }
              `}
            >

              {/* Hover Glow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  rounded-2xl
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  duration-300
                  bg-gradient-to-b
                  from-accent/[0.08]
                  via-transparent
                  to-transparent
                "
              />


              {/* Popular Badge */}
              {p.popular && (
                <span
                  className="
                    absolute
                    top-4
                    right-4
                    text-[11px]
                    font-medium
                    bg-accent
                    text-white
                    px-3
                    py-1
                    rounded-full
                    shadow-[0_5px_20px_rgba(109,93,246,0.35)]
                  "
                >
                  Most Popular
                </span>
              )}


              {/* Content */}
              <div className="relative z-10">

                {/* Plan Name */}
                <h3
                  className="
                    font-semibold
                    text-lg
                    mb-1
                    transition-colors
                    duration-300
                    group-hover:text-accent
                  "
                >
                  {p.name}
                </h3>

                <p className="text-white/40 text-xs mb-4">
                  {p.desc}
                </p>


                {/* Price */}
                <div className="flex items-baseline gap-2 mb-5">

                  <span
                    className="
                      text-3xl
                      font-bold
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  >
                    {p.price}
                  </span>

                  <span className="text-xs text-white/35">
                    / package
                  </span>

                </div>


                {/* Divider */}
                <div className="border-t border-white/10 mb-5" />


                {/* Features */}
                <ul className="space-y-3 mb-6 flex-1">

                  {p.features.map((f) => (

                    <li
                      key={f}
                      className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-white/60
                        transition-all
                        duration-300
                        group-hover:text-white/80
                      "
                    >

                      <span
                        className="
                          flex
                          items-center
                          justify-center
                          w-5
                          h-5
                          rounded-full
                          bg-accent/10
                          transition-all
                          duration-300
                          group-hover:bg-accent/20
                          group-hover:scale-110
                        "
                      >
                        <Check
                          size={12}
                          className="text-accent"
                        />
                      </span>

                      {f}

                    </li>

                  ))}

                </ul>


                {/* Button */}
                <NavLink
                  to="/contact"
                  className={`
                    group/btn
                    w-full
                    justify-center
                    transition-all
                    duration-300

                    ${
                      p.popular
                        ? 'btn-primary'
                        : 'btn-outline'
                    }
                  `}
                >

                  Get Started

                  <ArrowRight
                    size={15}
                    className="
                      transition-transform
                      duration-300
                      group-hover/btn:translate-x-1
                    "
                  />

                </NavLink>

              </div>

            </div>

          ))}

        </div>


        {/* ================= CUSTOM PACKAGE ================= */}
        <div
          className="
            group
            relative
            card
            px-6
            py-7
            text-center
            overflow-hidden

            transition-all
            duration-300

            hover:-translate-y-1
            hover:border-accent/40
            hover:shadow-[0_15px_40px_rgba(109,93,246,0.15)]
          "
        >

          {/* Background Glow */}
          <div
            className="
              absolute
              -top-20
              left-1/2
              -translate-x-1/2
              w-64
              h-32
              bg-accent/10
              blur-3xl
              rounded-full
              opacity-0
              group-hover:opacity-100
              transition-opacity
              duration-500
            "
          />


          {/* Icon */}
          <div
            className="
              relative
              w-10
              h-10
              mx-auto
              mb-3
              rounded-xl
              bg-accent/10
              border
              border-accent/20
              flex
              items-center
              justify-center

              transition-all
              duration-300

              group-hover:bg-accent/20
              group-hover:border-accent/40
              group-hover:scale-110
              group-hover:rotate-3
            "
          >

            <Sparkles
              size={18}
              className="text-accent"
            />

          </div>


          <h3
            className="
              relative
              text-xl
              font-semibold
              text-white
              mb-2
              transition-colors
              duration-300
              group-hover:text-accent
            "
          >
            Need a Custom Package?
          </h3>


          <p className="relative text-white/50 text-sm mb-4">
            Have a unique project in mind? Let's create a
            personalized package for your requirements.
          </p>


          <NavLink
            to="/contact"
            className="
              relative
              btn-primary
              inline-flex
              transition-all
              duration-300

              hover:scale-105
              hover:shadow-[0_8px_25px_rgba(109,93,246,0.35)]
            "
          >

            Contact Me

            <ArrowRight
              size={15}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />

          </NavLink>

        </div>


        {/* Small Bottom Text */}
        <p className="text-center text-xs text-white/30 mt-5">
          ✦ Custom requirements? Let's discuss your project.
        </p>

      </div>
    </div>
  )
}