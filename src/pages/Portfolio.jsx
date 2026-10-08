import { useState, useRef } from 'react'

import ad1 from '../assets/videos/ad1.mp4'
import ad2 from '../assets/videos/ad2.mp4'
import YouTubeShorts from '../assets/videos/YouTubeShorts.mp4'
import NatureReel from '../assets/videos/NatureReel.mp4'


// =====================================
// ONLY 3 CATEGORIES
// =====================================

const categories = [
  'All',
  'Advertisement',
  'Reels',
]


// =====================================
// PROJECTS
// =====================================

const projects = [
  {
    id: 'brand-ad',
    title: 'Brand Ad',
    video: ad1,
    tag: 'Advertisement',
    meta: '990K views · 1 week ago',
  },

  {
    id: 'product-ad',
    title: 'Product Ad',
    video: ad2,
    tag: 'Advertisement',
    meta: 'Advertisement',
  },

  {
    id: 'youtube-shorts',
    title: 'YouTube Shorts',
    video: YouTubeShorts,
    tag: 'Reels',
    meta: 'Shorts',
  },

  {
    id: 'nature-reel',
    title: 'Nature Reel',
    video: NatureReel,
    tag: 'Reels',
    meta: 'Reels',
  },
]


export default function Portfolio() {

  const [active, setActive] = useState('All')

  // Stable refs based on video ID
  const videoRefs = useRef({})


  const filtered =
    active === 'All'
      ? projects
      : projects.filter(
          (project) => project.tag === active
        )


  // =====================================
  // PLAY ONE VIDEO AT A TIME
  // =====================================

  const handlePlay = (currentId) => {

    Object.entries(videoRefs.current).forEach(
      ([id, video]) => {

        if (
          video &&
          id !== currentId
        ) {
          video.pause()
          video.currentTime = 0
        }

      }
    )

  }


  return (

    <div className="section-pad">

      <div className="container-x">


        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold mb-2">
            My Portfolio
          </h1>

          <p className="text-white/50">
            A collection of my best work across
            advertisements and reels.
          </p>

        </div>


        {/* ================================= */}
        {/* FILTER BUTTONS */}
        {/* ================================= */}

        <div className="flex flex-wrap gap-2 mb-8">

          {categories.map((category) => (

            <button
              key={category}
              onClick={() => setActive(category)}
              className={`
                px-4
                py-2
                rounded-full
                text-sm
                transition-all
                duration-300

                ${
                  active === category
                    ? `
                      bg-accent
                      text-white
                      shadow-[0_5px_20px_rgba(109,93,246,0.25)]
                    `
                    : `
                      bg-white/5
                      text-white/60
                      hover:bg-white/10
                      hover:text-white
                    `
                }
              `}
            >
              {category}
            </button>

          ))}

        </div>


        {/* ================================= */}
        {/* VIDEO GRID */}
        {/* ================================= */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {filtered.map((project) => (

            <div
              key={project.id}
              className="
                card
                overflow-hidden
                group
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-accent/30
                hover:shadow-[0_12px_35px_rgba(109,93,246,0.15)]
              "
            >

              {/* VIDEO */}

              <div className="aspect-video bg-black relative">

                <video
                  key={project.id}
                  ref={(element) => {

                    if (element) {
                      videoRefs.current[project.id] = element
                    } else {
                      delete videoRefs.current[project.id]
                    }

                  }}
                  src={project.video}
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                  controls
                  playsInline
                  preload="metadata"

                  onPlay={() => {
                    handlePlay(project.id)
                  }}
                />

              </div>


              {/* ================================= */}
              {/* VIDEO INFO */}
              {/* ================================= */}

              <div className="p-4">

                <p className="font-medium text-sm">
                  {project.title}
                </p>

                <p className="text-white/40 text-xs mt-1">
                  {project.meta}
                </p>

              </div>

            </div>

          ))}

        </div>


        {/* ================================= */}
        {/* EMPTY */}
        {/* ================================= */}

        {filtered.length === 0 && (

          <div className="text-center py-12">

            <p className="text-white/40">
              No projects available.
            </p>

          </div>

        )}

      </div>

    </div>

  )
}