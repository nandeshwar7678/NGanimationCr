import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ArrowRight, Clock, Search } from 'lucide-react'

export const posts = [
  {
    slug: 'what-is-ai-animation',
    title: 'What is AI Animation? A Complete Guide',
    date: 'Apr 15, 2025',
    read: '5 min read',
    tag: 'AI Animation',
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    excerpt:
      'AI animation is changing the way creators produce animated videos, stories and visual content.',
    body: [
      {
        heading: 'What is AI Animation?',
        text: 'AI animation is a modern approach to creating animated visuals with the help of artificial intelligence. Instead of creating every frame manually, creators can use AI tools to generate characters, environments, motion and visual effects much faster.'
      },
      {
        heading: 'Why is AI Animation becoming popular?',
        text: 'Traditional animation can require a large team, expensive software and a significant amount of production time. AI tools allow individual creators and small teams to experiment with cinematic ideas and produce content in a much shorter time.'
      },
      {
        heading: 'Benefits of AI Animation',
        text: 'Some of the biggest benefits include faster production, lower production costs, creative flexibility and the ability to quickly test different visual concepts.'
      },
      {
        heading: 'The Future of AI Animation',
        text: 'As AI video and animation tools continue to improve, creators will have more opportunities to produce unique stories, advertisements, social media content and cinematic experiences.'
      }
    ]
  },

  {
    slug: 'travel-adventure-project',
    title: 'Travel Adventure: A Cinematic AI Story',
    date: 'Apr 10, 2025',
    read: '4 min read',
    tag: 'Storytelling',
    image:
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',
    excerpt:
      'A cinematic travel story created with AI animation, visual storytelling and atmospheric environments.',
    body: [
      {
        heading: 'The Idea',
        text: 'The goal of this project was to create a cinematic travel experience without using a traditional film shoot. AI tools were used to visualize locations, environments and storytelling moments.'
      },
      {
        heading: 'Building the Visual World',
        text: 'The project combined mountains, forests, roads and cinematic landscapes with carefully designed camera movements. Consistency between scenes was one of the most important parts of the workflow.'
      },
      {
        heading: 'Creating the Story',
        text: 'Instead of simply showing beautiful locations, the video was designed around a simple journey. Each scene moved the viewer forward and helped create an emotional connection with the character.'
      },
      {
        heading: 'Final Result',
        text: 'The final video combined AI-generated visuals, animation, editing and sound design into a short cinematic experience.'
      }
    ]
  },

  {
    slug: 'freelancing-tips-for-beginners',
    title: 'Freelancing Tips for Beginners in Creative Content',
    date: 'Mar 28, 2025',
    read: '6 min read',
    tag: 'Freelancing',
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',
    excerpt:
      'Practical lessons about finding clients, pricing creative services and building a portfolio.',
    body: [
      {
        heading: 'Start With a Strong Portfolio',
        text: 'When starting freelancing, your portfolio is often more important than having a long list of clients. Show a small collection of your strongest work and make sure every project demonstrates a useful skill.'
      },
      {
        heading: 'Keep Your Services Clear',
        text: 'Clients should immediately understand what you offer. Clearly define services such as AI animation, advertisements, reels, YouTube videos and storytelling content.'
      },
      {
        heading: 'Communicate Clearly',
        text: 'Before starting a project, discuss the deadline, number of revisions, deliverables and pricing. Clear communication can prevent many problems later.'
      },
      {
        heading: 'Keep Learning',
        text: 'Creative technology changes quickly. Learning new AI tools, editing techniques and storytelling methods can help you create better work and stay competitive.'
      }
    ]
  },

  {
    slug: 'ai-video-for-brands',
    title: 'How Brands Can Use AI Video Content',
    date: 'Mar 20, 2025',
    read: '5 min read',
    tag: 'Advertisement',
    image:
      'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80',
    excerpt:
      'Discover how AI video can help brands create engaging advertisements and social media content.',
    body: [
      {
        heading: 'Why Video Matters for Brands',
        text: 'Video is one of the most effective formats for communicating a product or idea. Short cinematic videos can quickly demonstrate a product and create an emotional connection with viewers.'
      },
      {
        heading: 'AI Makes Production Flexible',
        text: 'AI video tools allow creative teams to experiment with different concepts, characters, environments and visual styles without requiring a complete physical production.'
      },
      {
        heading: 'Social Media Content',
        text: 'Brands can use AI-generated videos for Instagram Reels, YouTube Shorts, advertisements, product launches and promotional campaigns.'
      },
      {
        heading: 'The Important Part: Storytelling',
        text: 'Technology alone does not make a great advertisement. A strong concept, clear message and good storytelling are still essential.'
      }
    ]
  },

  {
    slug: 'cinematic-storytelling-with-ai',
    title: 'Creating Cinematic Stories With AI',
    date: 'Mar 12, 2025',
    read: '5 min read',
    tag: 'Storytelling',
    image:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
    excerpt:
      'A look at how AI tools can be combined with cinematic storytelling to create memorable videos.',
    body: [
      {
        heading: 'Start With the Story',
        text: 'Before generating visuals, define the story. Know who the character is, what they want and what changes by the end of the video.'
      },
      {
        heading: 'Create Visual Consistency',
        text: 'Character appearance, environment, lighting and visual style should remain consistent from scene to scene. This creates a more professional viewing experience.'
      },
      {
        heading: 'Use Cinematic Camera Movement',
        text: 'Camera movement can make AI-generated scenes feel more dynamic. Slow push-ins, tracking shots and wide establishing shots can add depth to a story.'
      },
      {
        heading: 'Combine Everything in Editing',
        text: 'The final quality comes from combining visuals, transitions, sound effects, music and pacing. Editing turns individual AI-generated clips into a complete story.'
      }
    ]
  },

  {
    slug: 'ai-reels-for-instagram',
    title: 'How to Create Better AI Reels for Instagram',
    date: 'Mar 05, 2025',
    read: '4 min read',
    tag: 'Reels',
    image:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
    excerpt:
      'Learn how AI-generated visuals can be turned into engaging Instagram Reels with better pacing and editing.',
    body: [
      {
        heading: 'Keep the Opening Strong',
        text: 'The first few seconds are important. Start with an interesting visual, movement or idea that immediately gives viewers a reason to continue watching.'
      },
      {
        heading: 'Use Short Scenes',
        text: 'Short scenes generally make it easier to maintain attention. Change the visual when the story or idea naturally moves to the next moment.'
      },
      {
        heading: 'Add Sound Design',
        text: 'Music, sound effects and subtle ambient sounds can make AI-generated scenes feel more immersive and polished.'
      },
      {
        heading: 'Export for Mobile',
        text: 'For Instagram Reels, vertical 9:16 video is usually the most suitable format. Keep important visual elements away from areas covered by interface controls.'
      }
    ]
  }
]

export default function Blog() {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('All')

  const tags = ['All', ...new Set(posts.map((post) => post.tag))]

  const filteredPosts = posts.filter((post) => {
    const matchesTag =
      activeTag === 'All' || post.tag === activeTag

    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.tag.toLowerCase().includes(search.toLowerCase())

    return matchesTag && matchesSearch
  })

  return (
    <div className="section-pad">
      <div className="container-x">

        {/* Header */}
        <div className="max-w-2xl mb-10">
          <p className="text-accent-soft text-sm font-medium mb-3">
            OUR BLOG
          </p>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Ideas, Stories & Insights
          </h1>

          <p className="text-white/50 leading-relaxed">
            Explore AI animation, cinematic storytelling, creative
            production, freelancing and social media content.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
          />

          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-accent/50 transition-colors"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-10">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                activeTag === tag
                  ? 'bg-accent text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredPosts.map((post) => (
              <NavLink
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group card overflow-hidden hover:-translate-y-1 transition-all duration-300"
              >

                {/* Image */}
                <div className="aspect-video overflow-hidden bg-white/5">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className="p-6">

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-accent-soft text-xs font-medium">
                      {post.tag}
                    </span>

                    <span className="text-white/30 text-xs">
                      {post.read}
                    </span>
                  </div>

                  <h2 className="font-semibold text-lg leading-snug mb-3 group-hover:text-accent-soft transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-white/45 text-sm leading-relaxed mb-5 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-white/35">
                    <span>{post.date}</span>

                    <span className="inline-flex items-center gap-1 text-white/60 group-hover:text-accent-soft transition-colors">
                      Read Article
                      <ArrowRight size={14} />
                    </span>
                  </div>

                </div>
              </NavLink>
            ))}

          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">
              No articles found
            </h3>

            <p className="text-white/40">
              Try a different search or category.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}