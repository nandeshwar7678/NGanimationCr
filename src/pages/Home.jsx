import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, ArrowRight, Sparkles, Instagram, Youtube ,Megaphone } from 'lucide-react'
import showcaseImg from '../assets/cover.png'
import aiAnimationImg from '../assets/AIAnimation.png'
import brandAdImg from '../assets/BrandAdvertisement.png'
import youtubeImg from '../assets/YoutubeContent.png'
import instaImg from '../assets/InstagramReels.png'


const stats = [
  { value: '500K+', label: 'Total Views' },
  { value: '100+', label: 'Projects' },
  { value: '50+', label: 'Happy Clients' },
  { value: '5+', label: 'Years Experience' },
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
      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-accent-soft font-medium mb-3">AI Animation & Creative Content Creator</p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
              Turning Ideas Into <span className="text-accent">Visual Stories</span>
            </h1>
            <p className="text-white/60 mb-8 max-w-lg">
              I create Al animation, short-form videos, and brand content that connect, engage and inspire. Let's bring your ideas to life with creativity and technology.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <NavLink to="/portfolio" className="btn-primary">
                <Play size={16} /> Watch My Work
              </NavLink>
              <NavLink to="/contact" className="btn-outline">Get a Quote</NavLink>
            </div>
            <div className="grid grid-cols-4 gap-4 max-w-md">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display font-bold text-xl">{s.value}</p>
                  <p className="text-white/40 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card aspect-[4/3] flex items-center justify-center overflow-hidden"
          >
            <img
              src={showcaseImg}
              alt="AI animation showcase"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Services preview */}
      <section className="section-pad bg-base-soft/40">
  <div className="container-x">
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      
      {/* Left side - heading, description, button */}
      <div className="lg:w-72 shrink-0">
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
      <div className="flex-1 overflow-x-hidden">
        <div className="flex gap-5 min-w-max pb-2">
          {services.map((s) => (
  <div
    key={s.title}
    className="card w-52 shrink-0 overflow-hidden hover:border-accent/40 transition-colors"
  >
    <div className="relative h-32 w-full overflow-hidden">
      <img
        src={s.image}
        alt={s.title}
        className="w-full h-full object-cover"
      />
      {/* Icon badge - image ke upar overlay */}
      <div className={`absolute bottom-2 right-2 w-8 h-8 rounded-full ${s.iconBg} backdrop-blur-sm flex items-center justify-center`}>
  <s.icon className="text-white" size={16} />
</div>
    </div>
    <div className="p-4">
      <h3 className="font-semibold mb-1">{s.title}</h3>
      <p className="text-white/50 text-sm mb-3">{s.desc}</p>
      <NavLink
        to="/services"
        className="inline-flex items-center gap-1 text-accent-soft text-sm"
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
              <NavLink to="/pricing" className="btn-outline">Get a Quote</NavLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
