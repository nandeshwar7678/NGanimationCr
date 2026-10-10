
import { motion } from 'framer-motion'
import { useState } from 'react'
import InteractiveBrandText from '../components/InteractiveBrandText'
import {
  ArrowRight,
  Sparkles,
  Clapperboard,
  Megaphone,
  Youtube,
  Instagram,
  MonitorPlay,
  WandSparkles,
  Video,
  CheckCircle2,
  MessageCircle,
  Palette,
  Zap,
} from 'lucide-react'

import showcaseImg from '../assets/cover.jpg'
import aiAnimationImg from '../assets/AIAnimation.jpg'
import brandAdImg from '../assets/BrandAdvertisement.jpg'
import youtubeImg from '../assets/YoutubeContent.jpg'
import instaImg from '../assets/InstagramReels.jpg'

const services = [
  {
    icon: Clapperboard,
    title: 'AI Animation',
    description:
      'Bring your imagination to life with engaging AI-generated stories, characters and cinematic animations.',
    image: aiAnimationImg,
    number: '01',
  },
  {
    icon: Megaphone,
    title: 'Brand Advertisements',
    description:
      'Creative promotional videos that help your brand stand out and communicate its value.',
    image: brandAdImg,
    number: '02',
  },
  {
    icon: Youtube,
    title: 'YouTube Content',
    description:
      'Story-driven videos, engaging visuals and creative content designed for your channel.',
    image: youtubeImg,
    number: '03',
  },
  {
    icon: Instagram,
    title: 'Reels & Shorts',
    description:
      'Eye-catching short-form videos for creators, businesses and social media brands.',
    image: instaImg,
    number: '04',
  },
]

const process = [
  {
    number: '01',
    title: 'Share Your Idea',
    description: 'Tell us your concept, audience and creative vision.',
  },
  {
    number: '02',
    title: 'We Create',
    description: 'We turn your idea into a polished visual experience.',
  },
  {
    number: '03',
    title: 'Ready to Publish',
    description: 'Receive your finished content, ready for your platform.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

export default function Home() {
  
const [mouse, setMouse] = useState({ x: -500, y: -500 })
const [isHovering, setIsHovering] = useState(false)
  return (
    
    <main className="min-h-screen overflow-hidden bg-[#070711] text-white">

      {/* FULL-WIDTH CINEMATIC HERO */}
      <section className="relative flex min-h-[78vh] items-center overflow-hidden bg-[#070711] sm:min-h-[88vh] lg:min-h-screen">

        <img
          src={showcaseImg}
          alt="NGanimationCr creative AI video production"
       className="absolute inset-0 h-full w-full object-cover object-center lg:object-[50%_center]"
          fetchPriority="high"
        />

        {/* Faded cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070711]/90 via-[#070711]/55 to-[#070711]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070711] via-[#070711]/10 to-[#070711]/25" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-6 py-28 sm:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="max-w-4xl"
          >
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-violet-200/90 sm:text-sm sm:tracking-[0.38em]">
              AI Animation · Digital Creativity · Visual Stories
            </p>

            <h1 className="text-5xl font-black leading-[1.08] tracking-tight text-white/95 sm:text-7xl lg:text-8xl">
              Ideas Into
              <span className="block bg-gradient-to-r from-white via-violet-200 to-blue-300 bg-clip-text text-transparent">
                Extraordinary
              </span>
              <span className="block text-white/65">
                Visual Stories.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 sm:text-xl">
              AI-powered animation, cinematic storytelling and creative
              video production for brands, creators and bold ideas.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="/portfolio"
                className="group inline-flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-6 py-4 font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-violet-300/60 hover:bg-white/15"
              >
                Explore Our Work
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </a>

              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-4 font-semibold text-white/75 transition hover:text-white"
              >
                <MessageCircle size={18} />
                Start a Project
              </a>
            </div>
          </motion.div>
        </div>

        {/* Minimal bottom label; no floating cards or play button */}
        <div className="absolute bottom-8 right-6 z-10 hidden text-right sm:block lg:right-16">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Creative Studio
          </p>
          <p className="mt-2 text-sm text-white/60">NGanimationCr</p>
        </div>
      </section>

      {/* CREATIVE STRIP */}
      <section className="border-y border-white/[0.07] bg-white/[0.025] px-5 py-7 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-5 text-center text-sm font-medium text-gray-300 sm:justify-between">
          <span className="flex items-center gap-2">
            <Sparkles size={17} className="text-violet-400" />
            AI-Powered Creativity
          </span>

          <span className="flex items-center gap-2">
            <Clapperboard size={17} className="text-violet-400" />
            Cinematic Storytelling
          </span>

          <span className="flex items-center gap-2">
            <MonitorPlay size={17} className="text-violet-400" />
            Digital Content
          </span>

          <span className="flex items-center gap-2">
            <Palette size={17} className="text-violet-400" />
            Creative Solutions
          </span>
        </div>
      </section>

      {/* SERVICES */}
     <section className="px-5 pt-16 pb-0 sm:px-8 sm:pt-20 lg:px-16 lg:pt-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-violet-400">
              What We Create
            </p>

            <h2 className="mt-4 text-3xl font-black sm:text-5xl">
              Creative Services for
              <span className="block bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                The Digital World
              </span>
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              From the first idea to the final frame, we help transform your
              vision into compelling digital content.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {services.map((service, index) => {
              const Icon = service.icon

              return (
                <motion.article
                  key={service.number}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group overflow-hidden rounded-2xl border border-white/[0.09] bg-[#10101b] transition duration-300 hover:-translate-y-2 hover:border-violet-400/40 hover:bg-[#141423]"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#10101b] via-transparent to-black/10" />

                    <span className="absolute right-4 top-4 rounded-lg border border-white/15 bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-md">
                      {service.number}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300 transition group-hover:bg-violet-500/20">
                      <Icon size={22} />
                    </div>

                    <h3 className="text-xl font-bold">{service.title}</h3>

                    <p className="mt-3 min-h-[84px] text-sm leading-7 text-gray-400">
                      {service.description}
                    </p>

                    <a
                      href="/contact"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-300 transition hover:text-white"
                    >
                      Discuss a Project
                      <ArrowRight
                        size={16}
                        className="transition group-hover:translate-x-1"
                      />
                    </a>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

     

      {/* HOW IT WORKS */}
      <section className="px-5 pt-16 pb-8 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-violet-400">
              How It Works
            </p>

            <h2 className="mt-4 text-3xl font-black sm:text-5xl">
              Simple Process.
              <span className="block text-gray-400">
                Powerful Results.
              </span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {process.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="relative rounded-2xl border border-white/10 bg-[#10101b] p-4 transition hover:border-violet-400/30 sm:p-9"
              >
                <span className="text-sm font-bold tracking-widest text-violet-400">
                  STEP {step.number}
                </span>

                <h3 className="mt-5 text-2xl font-bold">{step.title}</h3>

                <p className="mt-3 leading-7 text-gray-400">
                  {step.description}
                </p>

                {index < 2 && (
                  <ArrowRight
                    className="absolute right-7 top-8 hidden text-violet-400/50 md:block"
                    size={22}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

 


<section className="w-full overflow-hidden bg-black py-3 sm:py-5">
  <h2 className="w-full text-center text-[12vw] font-black leading-none">
    <InteractiveBrandText />
  </h2>
</section>


      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] px-5 py-7 sm:px-8 lg:px-16">
      </footer>
    </main>
  )
}