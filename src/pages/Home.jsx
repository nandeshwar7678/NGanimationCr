import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Play,
  ArrowRight,
  Sparkles,
  Instagram,
  Youtube,
  Megaphone,
  Lightbulb,
  Wand2,
  Heart,
  TrendingUp,
} from 'lucide-react'

import showcaseImg from '../assets/cover.png'
import heroBg from '../assets/cover.png'
import aiAnimationImg from '../assets/AIAnimation.png'
import brandAdImg from '../assets/BrandAdvertisement.png'
import youtubeImg from '../assets/YoutubeContent.png'
import instaImg from '../assets/InstagramReels.png'

const stats = [
  {
    value: '70M+',
    label: 'Total Views',
    icon: TrendingUp,
  },
  {
    value: '250+',
    label: 'Projects',
    icon: Wand2,
  },
  {
    value: '80+',
    label: 'Happy Clients',
    icon: Heart,
  },
  {
    value: '4+',
    label: 'Years Experience',
    icon: Sparkles,
  },
]

const services = [
  {
    title: 'AI Animation',
    description:
      'Create cinematic animated stories and characters using modern AI tools.',
    image: aiAnimationImg,
    icon: Wand2,
  },
  {
    title: 'Brand Advertisement',
    description:
      'Creative AI-powered advertisements designed to grab attention and convert viewers.',
    image: brandAdImg,
    icon: Megaphone,
  },
  {
    title: 'YouTube Shorts',
    description:
      'High-retention short-form videos designed for YouTube growth and reach.',
    image: youtubeImg,
    icon: Youtube,
  },
  {
    title: 'Instagram Reels',
    description:
      'Engaging and visually powerful reels made to stop the scroll.',
    image: instaImg,
    icon: Instagram,
  },
]

const processSteps = [
  {
    number: '01',
    title: 'The Idea',
    description:
      'Har great video ek simple idea se start hota hai. Hum idea ko clear story aur strong concept mein convert karte hain.',
    icon: Lightbulb,
  },
  {
    number: '02',
    title: 'AI Creation',
    description:
      'AI tools, visuals, characters, animation aur cinematic elements ko combine karke concept ko life di jaati hai.',
    icon: Wand2,
  },
  {
    number: '03',
    title: 'The Emotion',
    description:
      'Sirf beautiful visuals enough nahi hote. Story mein emotion, timing aur connection add kiya jata hai.',
    icon: Heart,
  },
  {
    number: '04',
    title: 'The Impact',
    description:
      'Final goal hai aisa content banana jo audience ko rok kar dekhe, yaad rahe aur share karne par majboor kare.',
    icon: TrendingUp,
  },
]

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
}

export default function Home() {
  return (
    <div className="bg-[#050509] text-white overflow-hidden">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="AI Creative Background"
            className="w-full h-full object-cover opacity-20"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#050509] via-[#050509]/95 to-[#050509]/60" />

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050509]/30 to-[#050509]" />
        </div>

        {/* Soft glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[150px]" />

        <div className="container-x relative z-10 w-full py-20 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Hero Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-3xl"
            >
              {/* Small Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md text-sm text-white/70 mb-6">
                <Sparkles size={15} className="text-purple-300" />
                AI Content Creator & Digital Storyteller
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight">
                Turning
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300">
                  Ideas Into
                </span>
                Stories People Remember.
              </h1>

              {/* Description */}
              <p className="mt-6 text-base sm:text-lg leading-8 text-white/60 max-w-2xl">
                I create AI-powered animations, cinematic videos,
                advertisements and social media content that transforms
                simple ideas into powerful visual experiences.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-8">

                <NavLink
                  to="/portfolio"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Play size={17} />
                  View My Work
                </NavLink>

                <NavLink
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-300"
                >
                  Let's Work Together
                  <ArrowRight size={17} />
                </NavLink>

              </div>

              {/* Mini Trust */}
              <div className="flex flex-wrap items-center gap-6 mt-10 text-sm text-white/40">
                <span>✓ AI Video Creation</span>
                <span>✓ Cinematic Storytelling</span>
                <span>✓ Social Media Content</span>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                duration: 0.9,
                ease: 'easeOut',
              }}
              className="relative"
            >
              <div className="relative max-w-xl mx-auto">

                {/* Glow */}
                <div className="absolute inset-10 bg-purple-600/20 blur-[100px]" />

                {/* Image */}
                <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] shadow-2xl">
                  <img
                    src={showcaseImg}
                    alt="NGanimationCr Creative Work"
                    className="w-full h-auto object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                {/* Floating label */}
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -bottom-5 -left-4 sm:-left-8 px-4 py-3 rounded-2xl border border-white/10 bg-[#0b0b12]/90 backdrop-blur-xl shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Sparkles size={18} className="text-purple-300" />
                    </div>

                    <div>
                      <p className="text-xs text-white/40">
                        Creative Power
                      </p>
                      <p className="text-sm font-semibold">
                        AI × Storytelling
                      </p>
                    </div>
                  </div>
                </motion.div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* =====================================================
          STATS
      ===================================================== */}
      <section className="border-y border-white/[0.06] bg-white/[0.015]">
        <div className="container-x py-8 sm:py-10">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

            {stats.map((stat, index) => {
              const Icon = stat.icon

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="flex items-center gap-4"
                >
                  <div className="w-11 h-11 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center shrink-0">
                    <Icon size={19} className="text-purple-300" />
                  </div>

                  <div>
                    <div className="text-xl sm:text-2xl font-bold">
                      {stat.value}
                    </div>

                    <div className="text-xs sm:text-sm text-white/40">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              )
            })}

          </div>

        </div>
      </section>


      {/* =====================================================
          SERVICES
      ===================================================== */}
      <section className="section-pad relative">

        <div className="container-x">

          {/* Section Heading */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="max-w-2xl mb-12"
          >
            <div className="flex items-center gap-2 text-sm text-purple-300 mb-3">
              <Sparkles size={16} />
              What I Create
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Creative Content
              <span className="text-white/40"> That Stands Out.</span>
            </h2>

            <p className="mt-4 text-white/50 leading-7">
              From AI animations to social media reels, I create
              visually engaging content designed to capture attention
              and tell a story.
            </p>
          </motion.div>


          {/* Service Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {services.map((service, index) => {
              const Icon = service.icon

              return (
                <motion.div
                  key={service.title}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.08,
                  }}
                  className="group"
                >

                  <div className="h-full rounded-2xl border border-white/[0.08] bg-white/[0.025] overflow-hidden hover:border-white/[0.16] hover:bg-white/[0.04] transition-all duration-500">

                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">

                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      {/* Icon */}
                      <div className="absolute top-4 left-4 w-10 h-10 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center">
                        <Icon
                          size={18}
                          className="text-white"
                        />
                      </div>

                    </div>


                    {/* Content */}
                    <div className="p-5">

                      <h3 className="text-lg font-semibold">
                        {service.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-white/45">
                        {service.description}
                      </p>

                      <NavLink
                        to="/services"
                        className="inline-flex items-center gap-2 mt-5 text-sm text-white/70 hover:text-white transition-colors"
                      >
                        Explore Service
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </NavLink>

                    </div>

                  </div>

                </motion.div>
              )
            })}

          </div>

        </div>
      </section>


      {/* =====================================================
          CREATIVE PROCESS
      ===================================================== */}
      <section className="section-pad relative bg-white/[0.012] border-y border-white/[0.05]">

        <div className="container-x">

          {/* Heading */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="max-w-3xl mb-12"
          >
            <div className="flex items-center gap-2 text-sm text-purple-300 mb-3">
              <Sparkles size={16} />
              My Creative Process
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              From a Simple Idea
              <span className="block text-white/40">
                to Something People Remember.
              </span>
            </h2>

            <p className="mt-5 text-white/50 leading-7 max-w-2xl">
              Every project is more than just visuals. The goal is to
              create an experience that looks beautiful, feels emotional
              and leaves an impact.
            </p>
          </motion.div>


          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">

            {/* Large Image */}
            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.7,
              }}
              className="relative"
            >

              <div className="absolute -inset-5 bg-purple-600/10 blur-[80px]" />

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">

                <img
                  src={showcaseImg}
                  alt="Creative AI Storytelling"
                  className="w-full aspect-[4/3] object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-sm text-white/80">
                    <Sparkles
                      size={15}
                      className="text-purple-300"
                    />
                    AI × Creativity × Storytelling
                  </div>
                </div>

              </div>

            </motion.div>


            {/* Process Steps */}
            <div className="space-y-4">

              {processSteps.map((step, index) => {
                const Icon = step.icon

                return (
                  <motion.div
                    key={step.number}
                    initial={{
                      opacity: 0,
                      x: 30,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.08,
                    }}
                    className="group flex gap-4 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.13] transition-all duration-300"
                  >

                    {/* Number */}
                    <div className="shrink-0">

                      <div className="w-11 h-11 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-xs font-semibold text-white/50">
                        {step.number}
                      </div>

                    </div>


                    {/* Content */}
                    <div className="flex-1">

                      <div className="flex items-center gap-2">

                        <Icon
                          size={17}
                          className="text-purple-300"
                        />

                        <h3 className="font-semibold">
                          {step.title}
                        </h3>

                      </div>

                      <p className="mt-2 text-sm leading-6 text-white/45">
                        {step.description}
                      </p>

                    </div>

                  </motion.div>
                )
              })}

            </div>

          </div>


          {/* Bottom CTA */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="mt-12 rounded-2xl border border-white/[0.08] bg-gradient-to-r from-purple-500/[0.08] to-indigo-500/[0.05] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >

            <div>
              <h3 className="text-xl sm:text-2xl font-semibold">
                Have an idea in mind?
              </h3>

              <p className="mt-2 text-sm text-white/45">
                Let's turn it into something people can't ignore.
              </p>
            </div>

            <NavLink
              to="/contact"
              className="btn-primary inline-flex items-center gap-2 shrink-0"
            >
              Start a Project
              <ArrowRight size={17} />
            </NavLink>

          </motion.div>

        </div>
      </section>


      {/* =====================================================
          LEARNING / CREATOR CTA
      ===================================================== */}
      <section className="section-pad">

        <div className="container-x">

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/[0.10] via-white/[0.025] to-indigo-500/[0.06] p-8 sm:p-12"
          >

            {/* Background glow */}
            <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-purple-500/10 blur-[100px]" />

            <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-8 items-center">

              <div className="max-w-2xl">

                <div className="inline-flex items-center gap-2 text-sm text-purple-300 mb-4">
                  <Sparkles size={16} />
                  Want to Learn AI Video Creation?
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold">
                  Learn AI Video Creation
                  <span className="text-white/40">
                    {' '}From Zero to Pro.
                  </span>
                </h2>

                <p className="mt-4 text-white/50 leading-7">
                  Learn how AI videos are created, how to write better
                  prompts, create consistent characters, generate
                  cinematic visuals and build content for social media.
                </p>

              </div>


              <NavLink
                to="/blog"
                className="btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Explore Learning Hub
                <ArrowRight size={17} />
              </NavLink>

            </div>

          </motion.div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section className="pb-20 sm:pb-24">

        <div className="container-x">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.98,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
            className="text-center max-w-3xl mx-auto"
          >

            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.04] mb-5">
              <Sparkles
                size={20}
                className="text-purple-300"
              />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Ready to Create Something
              <span className="text-white/40"> Amazing?</span>
            </h2>

            <p className="mt-4 text-white/45 leading-7 max-w-xl mx-auto">
              Whether you have a brand idea, a story or just a concept,
              let's transform it into powerful visual content.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">

              <NavLink
                to="/contact"
                className="btn-primary inline-flex items-center gap-2"
              >
                Start Your Project
                <ArrowRight size={17} />
              </NavLink>

              <NavLink
                to="/portfolio"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-300"
              >
                View Portfolio
                <Play size={16} />
              </NavLink>

            </div>

          </motion.div>

        </div>

      </section>

    </div>
  )
}