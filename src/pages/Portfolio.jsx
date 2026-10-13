
import { useState, useRef } from 'react'
import {
  Sparkles,
  Clapperboard,
  Video,
  Megaphone,
  ArrowUpRight,
} from 'lucide-react'

import ad1 from '../assets/videos/ad1.mp4'
import ad2 from '../assets/videos/ad2.mp4'
import ad3 from '../assets/videos/ad3.mp4'
import YouTubeShorts from '../assets/videos/YouTubeShorts.mp4'
import NatureReel from '../assets/videos/NatureReel.mp4'

const categories = [
  { name: 'All', icon: Clapperboard },
  { name: 'Advertisement', icon: Megaphone },
  { name: 'Reels', icon: Video },
]

const projects = [
  {
    id: 'nature-reel',
    title: 'Nature Reel',
    video: NatureReel,
    tag: 'Reels',
    meta: 'Creative Visuals',
  },
  {
    id: 'youtube-shorts',
    title: 'YouTube Shorts',
    video: YouTubeShorts,
    tag: 'Reels',
    meta: 'Short-Form Content',
  },
  {
    id: 'brand-ad-1',
    title: 'Brand Advertisement',
    video: ad1,
    tag: 'Advertisement',
    meta: '990K views · 1 month ago',
  },
  {
    id: 'product-ad-2',
    title: 'Product Advertisement',
    video: ad2,
    tag: 'Advertisement',
    meta: 'Product Showcase',
  },
  {
    id: 'product-ad-3',
    title: 'Product Ad 2',
    video: ad3,
    tag: 'Advertisement',
    meta: '440K views · 1 week ago',
  },
]

export default function Portfolio() {
  const [active, setActive] = useState('All')
  const videoRefs = useRef({})

  const filtered =
    active === 'All'
      ? projects
      : projects.filter((project) => project.tag === active)

  const handlePlay = (currentId) => {
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (video && id !== currentId) {
        video.pause()
        video.currentTime = 0
      }
    })
  }

  const handleCategoryChange = (category) => {
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video.pause()
        video.currentTime = 0
      }
    })

    setActive(category)
  }

  return (
    <main className="relative overflow-hidden pb-8 pt-3 sm:pb-10 sm:pt-4">
      <div className="container-x relative">

        {/* Compact premium header */}
        <header className="mb-6 sm:mb-7">
          <div className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300 sm:text-[11px]">
            <Sparkles size={13} />
            Creative Showcase
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            My{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
              Portfolio
            </span>
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
            Explore my AI advertisements, product videos and creative reels.
          </p>
        </header>

        {/* Compact category filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map(({ name, icon: Icon }) => {
            const isActive = active === name

            return (
              <button
                key={name}
                type="button"
                onClick={() => handleCategoryChange(name)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                  isActive
                    ? 'bg-violet-500 text-white'
                    : 'border border-white/10 bg-white/[0.035] text-slate-300 hover:bg-white/[0.08]'
                }`}
              >
                <Icon size={14} />
                {name}
              </button>
            )
          })}
        </div>

        {/* Portfolio grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {filtered.map((project) => (
            <article
              key={project.id}
              className="group overflow-hidden rounded-2xl border border-white/[0.09] bg-[#11101a] p-2 transition-[border-color,box-shadow] duration-300 hover:border-violet-400/25 hover:shadow-[0_10px_30px_rgba(109,93,246,0.10)]"
            >
              {/* Vertical video */}
              <div className="relative mx-auto aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-xl bg-black">
                <video
                  ref={(element) => {
                    if (element) {
                      videoRefs.current[project.id] = element
                    } else {
                      delete videoRefs.current[project.id]
                    }
                  }}
                  src={project.video}
                  className="block h-full w-full object-contain"
                  controls
                  controlsList="nodownload noplaybackrate"
                  disablePictureInPicture
                  playsInline
                  preload="metadata"
                  onPlay={() => handlePlay(project.id)}
                  aria-label={project.title}
                />

                <div className="pointer-events-none absolute left-2.5 top-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-black/70 px-2 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    {project.tag === 'Advertisement' ? (
                      <Megaphone size={11} />
                    ) : (
                      <Video size={11} />
                    )}
                    {project.tag}
                  </span>
                </div>
              </div>

              {/* Always-visible information; no hover text color change */}
              <div className="flex items-center justify-between gap-2 px-2 pb-2 pt-3">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-white">
                    {project.title}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    {project.meta}
                  </p>
                </div>

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300">
                  <ArrowUpRight size={15} />
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-sm text-slate-400">
              No projects available in this category.
            </p>
          </div>
        )}

        {/* Compact bottom CTA */}
        <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-gradient-to-r from-violet-500/[0.09] to-indigo-500/[0.06] p-5 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-white">
              Have a project in mind?
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Let's create something memorable for your brand.
            </p>
          </div>

          <a
            href="/contact"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          >
            Let's Work Together
            <ArrowUpRight size={16} />
          </a>
        </section>
      </div>
    </main>
  )
}
