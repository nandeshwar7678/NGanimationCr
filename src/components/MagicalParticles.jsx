import { motion } from 'framer-motion'

const particles = Array.from({ length: 45 }, (_, i) => ({
  id: i,
  left: `${(i * 47) % 100}%`,
  top: `${(i * 67) % 100}%`,
  size: i % 5 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5,
  duration: 9 + (i % 8),
  delay: (i % 10) * 0.7,
}))

export default function MagicalParticles() {
  return (
    <div
      className="fixed inset-0 z-[1] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >

      {/* Magical dots */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            boxShadow:
              '0 0 6px rgba(255,255,255,0.9), 0 0 14px rgba(129,140,248,0.65), 0 0 25px rgba(99,102,241,0.25)',
          }}
          animate={{
            y: [0, -35, -75, -110, 0],
            x: [0, 12, -10, 15, 0],
            opacity: [0, 0.35, 0.8, 0.3, 0],
            scale: [0.5, 1, 1.25, 0.8, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Soft magical glow */}
      <motion.div
        className="
          absolute
          w-72
          h-72
          rounded-full
          bg-purple-500/[0.06]
          blur-[110px]
        "
        animate={{
          x: ['0vw', '25vw', '10vw', '0vw'],
          y: ['10vh', '45vh', '75vh', '10vh'],
          opacity: [0.2, 0.5, 0.25, 0.2],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="
          absolute
          w-80
          h-80
          rounded-full
          bg-blue-500/[0.05]
          blur-[120px]
        "
        animate={{
          x: ['75vw', '55vw', '85vw', '75vw'],
          y: ['70vh', '20vh', '45vh', '70vh'],
          opacity: [0.15, 0.4, 0.2, 0.15],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

    </div>
  )
}