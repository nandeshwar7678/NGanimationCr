
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Play,
  Clapperboard,
} from 'lucide-react'

import aianimationS from '../assets/aianimationS.jpg'
import aivideocreationS from '../assets/aivideocreation.jpg'
import brandedS from '../assets/brandad.jpg'
import instagramS from '../assets/instareel.jpg'
import youtubeconstentS from '../assets/YouTube.jpg'
import storytellingS from '../assets/storytelling.jpg'
// import thinkingBoy from '../assets/thinkingBoy.png'
import youWantLearn from '../assets/blog/youWantLearn.jpg'

const services = [
  {
    title: 'AI Animation',
    slug: 'ai-animation',
    image: aianimationS,
    number: '01',
    category: 'ANIMATION',
    desc: 'Custom animated stories using AI tools that bring your ideas to life.',
  },
  {
    title: 'AI Video Creation',
    slug: 'ai-video-creation',
    image: aivideocreationS,
    number: '02',
    category: 'VIDEO PRODUCTION',
    desc: 'Concept to final video production with a cinematic touch.',
  },
  {
    title: 'Brand Advertisement',
    slug: 'brand-advertisement',
    image: brandedS,
    number: '03',
    category: 'BRAND & MARKETING',
    desc: 'Engaging ads for your brand that convert viewers into customers.',
  },
  {
    title: 'Instagram Reels',
    slug: 'instagram-reels',
    image: instagramS,
    number: '04',
    category: 'SOCIAL MEDIA',
    desc: 'Short-form content for social media built to grab attention fast.',
  },
  {
    title: 'YouTube Content',
    slug: 'youtube-content',
    image: youtubeconstentS,
    number: '05',
    category: 'YOUTUBE',
    desc: 'Long and short-form videos for YouTube, from script to upload.',
  },
  {
    title: 'Storytelling Videos',
    slug: 'storytelling-videos',
    image: storytellingS,
    number: '06',
    category: 'STORYTELLING',
    desc: 'Emotional and engaging storytelling that keeps viewers watching.',
  },
]

export default function Services() {
  const location = useLocation()
  const [selectedService, setSelectedService] = useState('')

  useEffect(() => {
    const slug = new URLSearchParams(location.search).get('service')

    if (!slug || !services.some((service) => service.slug === slug)) {
      setSelectedService('')
      return
    }

    setSelectedService(slug)

    const timer = window.setTimeout(() => {
      document
        .getElementById(`service-${slug}`)
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
    }, 200)

    return () => window.clearTimeout(timer)
  }, [location.pathname, location.search])

  return (
    <main className="relative isolate overflow-hidden bg-[#080810] text-white">
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-80 w-[600px] max-w-full -translate-x-1/2 rounded-full bg-violet-600/[0.12] blur-[120px]"
      />

      <div className="container-x relative z-10 py-7 sm:py-10 lg:py-12">



        {/* ================= SECTION TITLE ================= */}
        <section id="all-services" className="scroll-mt-24">
          <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300 sm:text-xs">
                What We Do
              </p>

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Explore Our Services
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
                The right creative solution for your next big idea.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-xs text-white/50">
              <Clapperboard size={14} className="text-violet-300" />
              {services.length} Creative Solutions
            </div>
          </div>

          {/* ================= SERVICE CARDS ================= */}
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
            {services.map((service) => {
              const isSelected = selectedService === service.slug

              return (
                <article
                  key={service.slug}
                  id={`service-${service.slug}`}
                  className={`group relative flex min-w-0 scroll-mt-28 flex-col overflow-hidden rounded-2xl border bg-[#101019] transition-all duration-300 ease-out hover:-translate-y-1 ${isSelected
                    ? 'border-violet-400/80 shadow-[0_0_0_1px_rgba(167,139,250,0.2),0_12px_35px_rgba(139,92,246,0.15)]'
                    : 'border-white/[0.08] hover:border-violet-400/40 hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]'
                    }`}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#171523]">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.0]"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101019] via-black/5 to-black/20" />

                    <span className="absolute left-3 top-3 rounded-lg border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white/90 backdrop-blur-md">
                      {service.number}
                    </span>

                    

                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-violet-200 sm:text-[10px]">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h3 className="text-base font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-violet-200 sm:text-lg">
                      {service.title}
                    </h3>

                    <p className="mt-2 flex-1 text-sm leading-6 text-white/45">
                      {service.desc}
                    </p>

                    <div className="my-4 border-t border-white/[0.07]" />

                    <NavLink
                      to={`/contact?service=${service.slug}`}
                      className="group/link inline-flex w-fit items-center gap-2 text-sm font-semibold text-violet-300 transition-colors duration-300 hover:text-white"
                    >
                      Discuss This Service
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover/link:translate-x-1"
                      />
                    </NavLink>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* ================= PROJECT CTA ================= */}

        <section
          className="group relative mt-8 overflow-hidden rounded-3xl border-0 bg-[#100f19] sm:mt-10"
          style={{
            backgroundImage: `
      linear-gradient(
        90deg,
        rgba(10, 9, 20, 0.96) 10%,
        rgba(10, 9, 20, 0.88) 25%,
        rgba(10, 9, 20, 0.58) 100%
      ),
      url(${youWantLearn})
    `,
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Soft ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-violet-500/15 blur-[90px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-0 h-56 w-56 rounded-full bg-indigo-500/10 blur-[85px]"
          />

          <div className="relative flex flex-col items-start justify-between gap-7 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8 lg:p-10">
            {/* CTA Content */}
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300 sm:text-xs">
                <Sparkles size={15} className="text-violet-300" />
                Let's Build Something Great
              </div>

              <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                Have a project in mind?
              </h2>


              <p className="mt-3 max-w-xl text-sm font-semibold leading-6 !text-violet-200 sm:text-base sm:leading-7">
                Tell us your vision. Let's turn your next creative idea into something memorable.
              </p>

            </div>

            {/* CTA Buttons */}
            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
              {/* <NavLink
        to="/contact"
        className="group/contact inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-violet-400 hover:to-indigo-400 hover:shadow-xl hover:shadow-violet-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#100f19]"
      >
        Start a Project
        <ArrowRight
          size={17}
          className="transition-transform duration-300 group-hover/contact:translate-x-1"
        />
      </NavLink> */}

              <a
                href="/Quotation.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/[0.08] px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
              >
                Get a Quote
                <ArrowUpRight size={17} className="text-violet-200" />
              </a>
            </div>
          </div>
        </section>

        {/* Bottom note */}
        <p className="mt-5 text-center text-xs font-medium tracking-wide text-slate-400">
          Thoughtful ideas. Creative execution. Content that stands out.
        </p>

      </div>
    </main>
  )
}
