import { NavLink } from 'react-router-dom'
import { Clapperboard, BookOpen, Lightbulb, Youtube, Heart, Download } from 'lucide-react'
import creatorImg from '../assets/aboutcreator.png'

// TODO: apna YouTube channel link yahan daalo
const CHANNEL_URL = 'https://www.youtube.com/@nganimationcr'

const pillars = [
  { icon: Clapperboard, name: 'Animation' },
  { icon: BookOpen, name: 'Storytelling' },
  { icon: Lightbulb, name: 'Creative Ideas' },
  { icon: Youtube, name: 'Entertainment' },
]

const journey = [
  { value: '4+', label: 'Years Experience' },
  { value: '250+', label: 'Projects' },
  { value: '80+', label: 'Happy Clients' },
  { value: '70M+', label: 'Total Views' },
]

const YELLOW = '#FFD23F'

export default function About() {
  return (
    <div className="section-pad bg-[#0b0d12]">
      {/* Handwritten fonts like the banner */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kaushan+Script&family=Caveat:wght@600;700&display=swap');
        .brush-title { font-family: 'Kaushan Script', cursive; }
        .hand { font-family: 'Caveat', cursive; }
        .brush-btn {
          clip-path: polygon(2% 18%, 8% 6%, 30% 12%, 55% 4%, 80% 10%, 97% 2%, 100% 30%, 96% 55%, 99% 82%, 90% 96%, 65% 90%, 40% 98%, 15% 92%, 3% 98%, 0% 70%, 3% 45%);
        }
        .hero-fade {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 28%);
                  mask-image: linear-gradient(to right, transparent 0%, #000 28%);
        }
        @media (max-width: 1023px) {
          .hero-fade {
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 22%);
                    mask-image: linear-gradient(to bottom, transparent 0%, #000 22%);
          }
        }
      `}</style>

      <div className="container-x">
        {/* HERO */}
        <section className="relative grid lg:grid-cols-2 gap-6 items-center">
          <div className="relative z-10">
            <h1 className="brush-title italic leading-none text-6xl sm:text-7xl xl:text-8xl text-white -rotate-2 mb-2">
              About <span style={{ color: YELLOW }}>Me</span>
            </h1>
            <svg viewBox="0 0 400 20" className="w-64 sm:w-80 mb-8" aria-hidden="true">
              <path d="M4 14 C 90 4, 220 4, 396 8" stroke={YELLOW} strokeWidth="7" strokeLinecap="round" fill="none" />
            </svg>

            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
              Hi, I'm Nganimationcr, a Content Creator
            </h2>
            <p className="text-white/80 text-lg leading-relaxed max-w-lg">
              I create engaging and creative videos that bring ideas, stories and
              emotions to life. From animation and storytelling to entertainment,
              this channel is my space to share what I love.
            </p>

            <ul className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-y-6 max-w-xl">
              {pillars.map((p, i) => (
                <li
                  key={p.name}
                  className={`flex flex-col items-center gap-2 text-center text-sm font-medium text-white px-2 ${i > 0 ? 'sm:border-l sm:border-white/15' : ''
                    }`}
                >
                  <p.icon size={34} strokeWidth={1.5} style={{ color: p.name === 'Entertainment' ? '#ff2d2d' : YELLOW }} />
                  {p.name}
                </li>
              ))}
            </ul>

            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noreferrer"
              className="brush-btn hand inline-flex items-center gap-3 mt-10 px-10 py-6 text-2xl sm:text-3xl font-bold text-[#0b0d12] -rotate-2 hover:rotate-0 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              style={{ background: YELLOW }}
            >
              Subscribe and Be Part of This Journey
              <Heart size={24} fill="currentColor" />
            </a>
          </div>

          <div className="relative -mx-4 lg:mx-0 lg:-mr-8 xl:-mr-16">
            <img
              src={creatorImg}
              alt="Creator editing a video at night with a laptop and camera on the desk"
              className="hero-fade w-full h-auto rounded-2xl"
            />
          </div>
        </section>

        {/* Tagline */}
        <p className="flex items-center justify-center gap-4 mt-14 text-white/60 tracking-[0.25em] text-sm">
          <span className="h-px w-12 bg-white/30" />
          DREAM <span className="text-white/30">|</span> CREATE <span className="text-white/30">|</span> SHARE
          <span className="h-px w-12 bg-white/30" />
        </p>

        {/* JOURNEY */}
        <section className="mt-20 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <h3 className="hand text-4xl font-bold mb-3" style={{ color: YELLOW }}>My Journey</h3>
            <p className="text-white/60 leading-relaxed max-w-md">
              I started as a passionate creator and grew into a full-time one,
              working with brands and businesses on content that inspires,
              entertains and makes a difference.
            </p>
            <NavLink
              to="/contact"
              className="inline-flex items-center gap-2 mt-6 text-sm text-white/80 underline underline-offset-4 hover:text-white"
            >
              {/* <Download size={16} /> Download My Resume */}
            </NavLink>
          </div>
          <dl className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 border-y border-white/10 sm:divide-x divide-white/10">
            {journey.map((j) => (
              <div key={j.label} className="py-6 px-4 sm:first:pl-0">
                <dd className="font-bold text-3xl text-white">{j.value}</dd>
                <dt className="text-white/50 text-sm mt-1">{j.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* Quote */}
        <p className="hand text-3xl sm:text-4xl text-white/80 mt-16 max-w-2xl border-l-4 pl-5" style={{ borderColor: YELLOW }}>
          "Good stories don't just tell, they connect."
          <span className="block text-base text-white/40 mt-1">Nganimationcr</span>
        </p>
      </div>
    </div>
  )
}