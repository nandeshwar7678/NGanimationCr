import { useState, useRef } from 'react'
import { Play } from 'lucide-react'
import ad1 from "../assets/videos/ad1.mp4"
import ad2 from "../assets/videos/ad2.mp4"
import videoa from "../assets/videos/videoa.mp4"
import videob from "../assets/videos/videob.mp4"
import videoc from "../assets/videos/videoc.mp4"
import Storytelling from "../assets/videos/storytelling.mp4"
import YouTubeShorts from "../assets/videos/YouTubeShorts.mp4"
import NatureReel from "../assets/videos/NatureReel.mp4"
import GamingAnimation from "../assets/videos/GamingAnimation.mp4"



const categories = ['All', 'AI Animation', 'Advertisement', 'Storytelling', 'Reels']

const projects = [
  {
    title: 'AI Love Story',
    video: videoa,
    tag: 'AI Animation',
    meta: '2.6M views · 5 days ago'
  },
  {
    title: 'Travel Adventure',
    video: Storytelling,
    tag: 'Storytelling',
    meta: '1.8M views · 1 week ago'
  },
  {
    title: 'Brand Ad',
    video: ad1,
    tag: 'Advertisement',
    meta: '990K views · 1 week ago'
  },
  {
    title: 'YouTube Shorts',
    video: YouTubeShorts,
    tag: 'Reels',
    meta: 'Shorts'
  },
  {
    title: 'Character Animation',
    video: videob,
    tag: 'AI Animation',
    meta: 'Animation'
  },
  {
    title: 'Product Ad',
    video: ad2,
    tag: 'Advertisement',
    meta: 'Advertisement'
  },
  {
    title: 'Emotional Story',
    video: videoc,
    tag: 'Storytelling',
    meta: 'Storytelling'
  },
  {
    title: 'Nature Reel',
    video: NatureReel,
    tag: 'Reels',
    meta: 'Reels'
  },
  {
    title: 'Gaming Animation',
    video: GamingAnimation,
    tag: 'AI Animation',
    meta: 'Animation'
  },
]

export default function Portfolio() {
  const [active, setActive] = useState('All')
  const videoRefs = useRef([])
  const filtered = active === 'All' ? projects : projects.filter((p) => p.tag === active)

  return (
    <div className="section-pad">
      <div className="container-x">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Portfolio</h1>
          <p className="text-white/50">A collection of my best work across different styles and platforms.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${active === c ? 'bg-accent text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <div key={p.title} className="card overflow-hidden group cursor-pointer">
              <div className="aspect-video relative">
                <video
                  ref={(el) => (videoRefs.current[i] = el)}
                  src={p.video}
                  className="w-full h-full object-cover"
                  controls
                  // muted
                  // loop
                  playsInline
                  onPlay={() => {
                    videoRefs.current.forEach((video, index) => {
                      if (video && index !== i) {
                        video.pause()
                         video.currentTime = 0
                      }
                    })
                  }}
                />
                {/* <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="text-white" size={30} />
                </div> */}
              </div>
              <div className="p-4">
                <p className="font-medium text-sm">{p.title}</p>
                <p className="text-white/40 text-xs">{p.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
