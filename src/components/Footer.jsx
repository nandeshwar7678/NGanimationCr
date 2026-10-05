import { NavLink } from 'react-router-dom'
import { Instagram, Youtube, Facebook, AtSign, Sparkles } from 'lucide-react'
import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-10">
      <div className="container-x py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <NavLink to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <img src={logo} alt="NGanimationCr logo" className="h-8 w-8 object-contain" />
            NGanimationCr
          </NavLink>
          <p className="text-white/50 text-sm leading-relaxed">
            Creating stories with AI — engaging videos and creative content for brands and dreamers.
          </p>
          <div className="flex gap-3 mt-4 text-white/60">
            <a href="https://instagram.com/NGanimationCr" target="_blank" rel="noopener noreferrer">
              <Instagram size={18} className="hover:text-white cursor-pointer" />
            </a>
            <a href="https://youtube.com/@NGanimation_Cr" target="_blank" rel="noopener noreferrer">
              <Youtube size={18} className="hover:text-white cursor-pointer" />
            </a>
            <a href="https://threads.net/@NGanimationCr" target="_blank" rel="noopener noreferrer">
              <AtSign size={18} className="hover:text-white cursor-pointer" />
            </a>
            <a href="https://facebook.com/NGanimationCr" target="_blank" rel="noopener noreferrer">
              <Facebook size={18} className="hover:text-white cursor-pointer" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/50">
            <li><NavLink to="/about" className="hover:text-white">About</NavLink></li>
            <li><NavLink to="/services" className="hover:text-white">Services</NavLink></li>
            <li><NavLink to="/portfolio" className="hover:text-white">Portfolio</NavLink></li>
            <li><NavLink to="/blog" className="hover:text-white">Blog</NavLink></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Services</h4>
          <ul className="space-y-2 text-sm text-white/50">
            <li>AI Animation</li>
            <li>Brand Advertisement</li>
            <li>Instagram Reels</li>
            <li>YouTube Content</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Contact</h4>
          <ul className="space-y-2 text-sm text-white/50">
            <li>NGanimationCr@gmail.com</li>
            <li>+91 7498699607</li>
            <li>Pune 411057, India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-5 text-center text-white/40 text-xs">
        © {new Date().getFullYear()} NGanimationCr. All rights reserved.
      </div>
    </footer>
  )
}