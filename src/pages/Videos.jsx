import { useState } from 'react'
import { Play } from 'lucide-react'

const tabs = ['All', 'Shorts', 'Animation', 'Storytelling']

const videos = [
  { title: 'AI Love Story', tag: 'Storytelling' },
  { title: 'Travel Adventure', tag: 'Animation' },
  { title: 'Brand Toss Videos', tag: 'Shorts' },
  { title: 'Storytelling Videos', tag: 'Storytelling' },
  { title: 'Character Animation', tag: 'Animation' },
  { title: 'Product Ad', tag: 'Shorts' },
]

export default function Videos() {
  const [tab, setTab] = useState('All')
  const filtered = tab === 'All' ? videos : videos.filter((v) => v.tag === tab)

  return (
    <div className="section-pad">
      <div className="container-x">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Videos</h1>
          <p className="text-white/50">Watch my latest creations, from animations to brand promotions and storytelling.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                tab === t ? 'bg-accent text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((v, i) => (
            <div key={v.title} className="card overflow-hidden group cursor-pointer">
              <div className="aspect-video relative">
                <img
                  src={`https://picsum.photos/seed/video${i}/500/300`}
                  alt={v.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="text-white" size={30} />
                </div>
              </div>
              <div className="p-4">
                <p className="font-medium text-sm">{v.title}</p>
                <p className="text-white/40 text-xs">{v.tag}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
