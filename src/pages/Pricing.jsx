import { NavLink } from 'react-router-dom'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Basic',
    price: '₹2,500',
    desc: 'Perfect for small projects.',
    features: ['1 Video (up to 50 sec)', 'Basic Editing', 'HD Output', '1 Revision'],
  },
  {
    name: 'Standard',
    price: '₹10,000',
    desc: 'Most popular choice.',
    popular: true,
    features: ['5 Videos (up to 1 min)', 'Advanced Editing', 'HD + 4K Output', '3 Revisions'],
  },
  {
    name: 'Premium',
    price: '₹25,000',
    desc: 'For brands & businesses.',
    features: ['5+ Videos (up to 2 min)', 'Full Animation', '4K + Pro Quality', 'Unlimited Revisions'],
  },
]

export default function Pricing() {
  return (
    <div className="section-pad">
      <div className="container-x">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-2">Pricing</h1>
          <p className="text-white/50">Simple, transparent pricing for your creative needs.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`card p-8 flex flex-col ${p.popular ? 'border-accent shadow-glow' : ''}`}
            >
              {p.popular && (
                <span className="text-xs bg-accent px-3 py-1 rounded-full w-fit mb-4">Most Popular</span>
              )}
              <h3 className="font-semibold text-lg mb-1">{p.name}</h3>
              <p className="text-white/40 text-sm mb-4">{p.desc}</p>
              <p className="text-3xl font-bold mb-6">{p.price}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                    <Check size={14} className="text-accent" /> {f}
                  </li>
                ))}
              </ul>
              <NavLink to="/contact" className={p.popular ? 'btn-primary justify-center' : 'btn-outline justify-center'}>
                Get Started
              </NavLink>
            </div>
          ))}
        </div>

        <div className="card p-10 text-center">
          <h3 className="text-xl font-semibold mb-2">Need a custom package?</h3>
          <p className="text-white/50 mb-6">Get in touch for a personalized quote.</p>
          <NavLink to="/contact" className="btn-primary inline-flex">Contact Me</NavLink>
        </div>
      </div>
    </div>
  )
}
