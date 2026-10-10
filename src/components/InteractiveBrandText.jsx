
import { useState } from 'react'

export default function InteractiveBrandText() {
  const [point, setPoint] = useState({ x: -300, y: -300 })
  const [active, setActive] = useState(false)

  const updatePoint = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setActive(true)
  }

  return (
    <span
      className="relative inline-block whitespace-nowrap"
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') updatePoint(e)
      }}
      onPointerLeave={() => setActive(false)}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        updatePoint(e)
      }}
      onPointerMove={(e) => {
        if (e.pointerType === 'touch' && e.buttons === 0) return
        updatePoint(e)
      }}
      onPointerUp={() => setActive(false)}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Outline only: no white fill */}
      <span
        className="block text-transparent"
        style={{
          WebkitTextStroke: '1px rgba(255,255,255,0.4)',
        }}
      >
        NGanimationCr
      </span>

      {/* Red-orange highlight follows pointer */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 block text-transparent"
        style={{
          opacity: active ? 1 : 0,
          backgroundImage:
            'linear-gradient(100deg, #ff2418, #ff5722, #ff9b38)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextStroke: '1px rgba(255,100,35,0.9)',
          maskImage: `radial-gradient(circle 75px at ${point.x}px ${point.y}px, black 0%, black 35%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 75px at ${point.x}px ${point.y}px, black 0%, black 35%, transparent 100%)`,
          transition: 'opacity 150ms ease',
        }}
      >
        NGanimationCr
      </span>
    </span>
  )
}