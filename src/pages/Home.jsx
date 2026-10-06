import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, ArrowRight, Sparkles, Instagram, Youtube, Megaphone } from 'lucide-react'
import showcaseImg from '../assets/cover.png'
import heroBg from '../assets/cover.png'
import aiAnimationImg from '../assets/AIAnimation.png'
import brandAdImg from '../assets/BrandAdvertisement.png'
import youtubeImg from '../assets/YoutubeContent.png'
import instaImg from '../assets/InstagramReels.png'


const stats = [
  { value: '70M+', label: 'Total Views' },
  { value: '250+', label: 'Projects' },
  { value: '80+', label: 'Happy Clients' },
  { value: '4+', label: 'Years Experience' },
]

const services = [
  {
    title: "AI Animation",
    desc: "Custom AI animated videos for your brand, story or idea.",
    icon: Sparkles,
    image: aiAnimationImg,
    iconBg: "bg-purple-600",
  },
  {
    title: "Brand Advertisement",
    desc: "Engaging video ads that bring your brand to life.",
    icon: Megaphone,
    image: brandAdImg,
    iconBg: "bg-orange-500",
  },
  {
    title: "YouTube Shorts",
    desc: "Short, viral & engaging videos for YouTube.",
    icon: Youtube,
    image: youtubeImg,
    iconBg: "bg-red-600",
  },
  {
    title: "Instagram Reels",
    desc: "Trendy, creative and scroll-stopping reels for Instagram.",
    icon: Instagram,
    image: instaImg,
    iconBg: "bg-gradient-to-br from-purple-600 to-pink-500",
  }
];

const projects = [
  { title: 'AI Love Story', tag: 'AI Animation' },
  { title: 'Travel Adventure', tag: 'Storytelling' },
  { title: 'Brand Promotion', tag: 'Advertisement' },
  { title: 'Character Animation', tag: 'Animation' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      {/* Hero */}
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden">

        {/* Animated Background */}
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={heroBg}
            alt="NGanimationCr AI Animation"
            className="w-full h-full object-cover object-[95%_center] sm:object-[70%_center] md:object-[67%_center] lg:object-center"
          />
        </motion.div>

        {/* Dark cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-r 
    from-[#080b1c] via-[#080b1c]/85 to-transparent"
        />

        {/* Bottom dark fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 
    bg-gradient-to-t from-[#080b1c] to-transparent"
        />

        {/* Content */}
        <div className="relative z-10 container-x min-h-[calc(100vh-80px)] 
    flex items-center">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl py-20"
          >

            <p className="inline-flex items-center rounded-full p-[1px] mb-4 bg-gradient-to-r from-cyan-400/70 via-blue-500/60 to-purple-500/80">
              <span className="rounded-full bg-[#080b1c] px-5 py-2 text-sm sm:text-base font-semibold !text-white opacity-100 whitespace-nowrap">
                AI Animation & Creative Content Creator
              </span>
            </p>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold 
        leading-[1.05] mb-6"
            >
              Turning Ideas Into{" "}
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(99,102,241,0.35)]">
                Visual Stories
              </span>
            </h1>

            <p className="text-white/65 text-base sm:text-lg 
        max-w-xl mb-8 leading-relaxed"
            >
              I create AI animation, short-form videos, and brand content
              that connect, engage and inspire. Let's bring your ideas to
              life with creativity and technology.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">

              <NavLink
                to="/portfolio"
                className="btn-primary"
              >
                <Play size={16} />
                Watch My Work
              </NavLink>

              <a
                href="/Quotation.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Get a Quote
              </a>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-xl">

              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.6 + i * 0.1
                  }}
                  className="px-2 sm:px-4 border-r border-white/20 last:border-r-0"
                >
                  <p className="font-display font-bold text-2xl">
                    {s.value}
                  </p>

                  <p className="text-white/45 text-[11px] sm:text-xs mt-1 whitespace-nowrap">
                    {s.label}
                  </p>
                </motion.div>
              ))}

            </div>

          </motion.div>

        </div>

        {/* Cinematic glow */}
        <motion.div
          animate={{
            opacity: [0.15, 0.3, 0.15],
            scale: [1, 1.08, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute right-[20%] top-[30%] 
      w-72 h-72 rounded-full bg-purple-500/20 
      blur-[100px] pointer-events-none"
        />

      </section>

      {/* Services preview */}
      <section className="section-pad bg-base-soft/40">
        <div className="container-x">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* Left side - heading, description, button */}
            <div className="lg:w-64 shrink-0">
              <p className="text-accent-soft text-sm font-semibold mb-2 tracking-wide">WHAT I DO</p>
              <h2 className="text-3xl font-bold mb-4">
                My <span className="text-accent">Services</span>
              </h2>
              <p className="text-white/50 mb-6">
                From AI animation to brand promotions, I offer a wide range
                of creative services to help you grow your brand and tell
                your story in the best way.
              </p>
              <NavLink
                to="/services"
                className="inline-flex items-center gap-2 border border-white/15 rounded-full px-5 py-2.5 text-sm hover:border-accent/50 hover:text-accent transition-colors"
              >
                View All Services <ArrowRight size={14} />
              </NavLink>
            </div>

            {/* Right side - horizontal scrollable cards */}
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex gap-5 min-w-max pb-2">
                {services.map((s) => (
                  <div
                    key={s.title}
                    className="card w-52 shrink-0 overflow-hidden hover:border-accent/40 transition-colors"
                  >
                    <div className="relative h-32 w-full">
                      <img
                        src={s.image}
                        alt={s.title}
                        className="w-full h-full object-cover rounded-t-xl"
                      />
                      {/* Icon badge - image ke upar overlay */}
                      <div
                        className={`absolute -bottom-4 right-4 w-11 h-11 rounded-full
  ${s.iconBg}
  border-2 border-[#080b1c]
  flex items-center justify-center
  shadow-lg z-10`}
                      >
                        <s.icon className="text-white" size={20} />
                      </div>
                    </div>
                    <div className="p-4 flex flex-col h-[160px]">
                      <h3 className="font-semibold mb-1">{s.title}</h3>

                      <p className="text-white/50 text-sm mb-3 flex-1">
                        {s.desc}
                      </p>

                      <NavLink
                        to="/services"
                        className="inline-flex items-center gap-1 text-accent-soft text-sm mt-auto"
                      >
                        Explore <ArrowRight size={12} />
                      </NavLink>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured portfolio */}
      <section className="section-pad">
        <div className="container-x">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-3xl font-bold">Featured Portfolio</h2>
            <NavLink to="/portfolio" className="hidden sm:inline-flex items-center gap-1 text-accent-soft text-sm">
              View All <ArrowRight size={14} />
            </NavLink>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {projects.map((p, i) => (
              <div key={p.title} className="card overflow-hidden group cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-accent/30 to-accent-pink/20 flex items-center justify-center relative">
                  <img
                    src={`https://picsum.photos/seed/kp${i}/400/240`}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="text-white" size={28} />
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-medium text-sm">{p.title}</p>
                  <p className="text-white/40 text-xs">{p.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad">
        <div className="container-x">
          <div className="card p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-accent/20 to-transparent">
            <div>
              <h3 className="text-2xl font-bold mb-1">Let's Create Something Amazing Together</h3>
              <p className="text-white/50">Have a project in mind? I'd love to hear from you.</p>
            </div>
            <div className="flex gap-4 shrink-0">
              <NavLink to="/contact" className="btn-primary">Hire Me</NavLink>
              <a
                href="/Quotation.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Get a Quote
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
