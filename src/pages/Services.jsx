import { NavLink } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import aianimationS from "../assets/aianimationS.png"
import aivideocreationS from "../assets/aivideocreation.png"
import brandedS from "../assets/brandad.png"
import instagramS from "../assets/instareel.png"
import youtubeconstentS from "../assets/YouTube.png"
import storytellingS from "../assets/storytelling.png"

const services = [
  {
    title: 'AI Animation',
    image: aianimationS,
    desc: 'Custom animated stories using AI tools that bring your ideas to life.'
  },
  {
    title: 'AI Video Creation',
    image: aivideocreationS,
    desc: 'Concept to final video production with a cinematic touch.'
  },
  {
    title: 'Brand Advertisement',
    image: brandedS,
    desc: 'Engaging ads for your brand that convert viewers into customers.'
  },
  {
    title: 'Instagram Reels',
    image: instagramS,
    desc: 'Short-form content for social media built to grab attention fast.'
  },
  {
    title: 'YouTube Content',
    image: youtubeconstentS,
    desc: 'Long & short form videos for YouTube, from script to upload.'
  },
  {
    title: 'Storytelling Videos',
    image: storytellingS,
    desc: 'Emotional & engaging storytelling that keeps viewers watching.'
  },
]

export default function Services() {
  return (
    <div className="section-pad">
      <div className="container-x">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Our Services</h1>
          <p className="text-white/50">Creative solutions to bring your ideas to life.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((s) => (
            <div key={s.title} className="card overflow-hidden group">
              <div className="aspect-video overflow-hidden bg-gradient-to-br from-accent/25 to-accent-pink/15">
                {s.image && (
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>
              <div className="p-6">
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-white/50 text-sm mb-4">{s.desc}</p>
                <NavLink to="/contact" className="text-accent-soft text-sm inline-flex items-center gap-1">
                  Learn More <ArrowRight size={14} />
                </NavLink>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-accent/20 to-transparent">
          <div>
            <h3 className="text-2xl font-bold mb-1">Have a project in mind?</h3>
            <p className="text-white/50">Let's discuss how I can help you.</p>
          </div>
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
  )
}
