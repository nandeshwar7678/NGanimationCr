import { useEffect } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { posts } from './Blog.jsx'
import blogCover from '../assets/blog/blogCoverD.jpg'
import youWantLearn from '../assets/blog/youWantLearn.jpg'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from 'lucide-react'

export default function BlogDetail() {
  const { slug } = useParams()

  const post = posts.find((p) => p.slug === slug)

  useEffect(() => {
    if (!post) return

    document.title = `${post.title} | NGanimationCr`

    const description = post.excerpt

    let meta = document.querySelector(
      'meta[name="description"]'
    )

    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }

    meta.setAttribute('content', description)

    const canonical =
      document.querySelector('link[rel="canonical"]')

    if (canonical) {
      canonical.href =
        `${window.location.origin}/blog/${post.slug}`
    }

    // Article structured data
    const oldSchema = document.getElementById(
      'blog-article-schema'
    )

    if (oldSchema) {
      oldSchema.remove()
    }

    const script = document.createElement('script')

    script.id = 'blog-article-schema'
    script.type = 'application/ld+json'

    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      author: {
        '@type': 'Organization',
        name: 'NGanimationCr',
      },
      publisher: {
        '@type': 'Organization',
        name: 'NGanimationCr',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id':
          `${window.location.origin}/blog/${post.slug}`,
      },
    })

    document.head.appendChild(script)

    return () => {
      const schema = document.getElementById(
        'blog-article-schema'
      )

      if (schema) {
        schema.remove()
      }
    }
  }, [post])

  if (!post) {
    return (
      <div className="section-pad">
        <div className="container-x max-w-3xl text-center py-16">

          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <BookOpen
              size={25}
              className="text-accent"
            />
          </div>

          <h1 className="text-3xl font-bold mb-3">
            Article Not Found
          </h1>

          <p className="text-white/45 mb-6">
            The learning article you are looking for does not exist.
          </p>

          <NavLink
            to="/blog"
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Learning Hub
          </NavLink>

        </div>
      </div>
    )
  }

  const related = posts
    .filter(
      (p) =>
        p.slug !== post.slug &&
        p.tag === post.tag
    )
    .slice(0, 2)

  return (
    <div className="section-pad">
      <article className="container-x max-w-4xl">

        {/* BACK */}
        <NavLink
          to="/blog"
          className="inline-flex items-center gap-2 text-white/40 text-sm mb-7 hover:text-white transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Learning Hub
        </NavLink>

        {/* HERO WITH UNIVERSAL BACKGROUND IMAGE */}
        <div className="relative isolate overflow-hidden rounded-3xl border border-white/10 mb-8 min-h-[320px] sm:min-h-[350px] bg-[#101225]">

          {/* Background Image */}
          <img
            src={blogCover}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 w-full h-full object-cover object-center"
          />

          {/* Dark Overlay for Readability */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0b1020]/95 via-[#0b1020]/75 to-[#0b1020]/25" />

          {/* Purple Glow */}
          <div className="absolute -right-24 -top-24 -z-10 w-72 h-72 rounded-full bg-accent/20 blur-3xl" />

          {/* Hero Content */}
          <div className="relative p-6 sm:p-10">

            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 text-xs text-accent-soft bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                <Sparkles size={12} />
                {post.tag}
              </span>

              <span className="text-xs text-white/70">
                {post.level}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-5 text-white">
              {post.title}
            </h1>

            <p className="text-white/75 leading-relaxed max-w-3xl mb-5">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
              <span>{post.date}</span>

              <span className="w-1 h-1 rounded-full bg-white/50" />

              <span className="inline-flex items-center gap-1">
                <Clock size={14} />
                {post.read}
              </span>
            </div>

          </div>
        </div>

        {/* LEARNING OBJECTIVE */}
        <div className="card p-5 sm:p-6 mb-9 border-accent/20 bg-accent/[0.04]">

          <div className="flex items-start gap-3">

            <div className="w-9 h-9 shrink-0 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <BookOpen
                size={17}
                className="text-accent"
              />
            </div>

            <div>

              <h2 className="font-semibold mb-1">
                Is lesson ke baad aap kya seekhenge?
              </h2>

              <p className="text-white/45 text-sm leading-relaxed">
                Is guide ko step-by-step follow karke aap
                practical AI content creation workflow ko
                samajh sakte hain aur apne projects par apply
                kar sakte hain.
              </p>

            </div>

          </div>

        </div>

        {/* ARTICLE */}
        <div className="max-w-3xl">

          {post.body.map((section, index) => (

            <section
              key={index}
              className="mb-9"
            >

              <div className="flex items-start gap-4">

                <div className="hidden sm:flex shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 items-center justify-center text-xs text-accent">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="flex-1">






                  <div className="relative mb-6">
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none
      drop-shadow-[0_4px_5px_rgba(251,191,36,0.25)]"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <polygon
                        points="0,0 88,0 100,100 0,100"
                        fill="rgba(251,191,36,0.04)"
                        stroke="#fbbf24"
                        strokeWidth="0.5"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>

                    <h2
                      className="relative px-5 py-4 pr-10 text-xl sm:text-2xl
      font-bold text-white"
                    >
                      {section.heading}
                    </h2>
                  </div>






                  <p className="text-white/60 leading-8 text-base sm:text-lg">
                    {section.text}
                  </p>

                </div>

              </div>

            </section>

          ))}

        </div>

        {/* WORKFLOW BOX */}
        <div className="card p-6 sm:p-7 mt-10 border-accent/20 bg-gradient-to-br from-accent/10 to-transparent">

          <div className="flex items-center gap-2 mb-4">

            <CheckCircle2
              size={19}
              className="text-accent"
            />

            <h2 className="font-semibold">
              Quick Workflow
            </h2>

          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">

            {[
              'Idea',
              'Script',
              'Prompt',
              'Image',
              'Video',
              'Voice',
              'Editing',
              'Upload',
              'Analytics',
            ].map((step, index) => (

              <div
                key={step}
                className="flex items-center gap-2"
              >

                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/65">
                  {step}
                </span>

                {index < 8 && (
                  <ArrowRight
                    size={13}
                    className="text-white/20"
                  />
                )}

              </div>

            ))}

          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/10 my-12" />

        {/* RELATED */}
        {related.length > 0 && (

          <section>

            <div className="flex items-end justify-between mb-5">

              <div>

                <p className="text-accent-soft text-xs font-medium mb-1">
                  CONTINUE LEARNING
                </p>

                <h2 className="text-2xl font-bold">
                  Related Lessons
                </h2>

              </div>

              <NavLink
                to="/blog"
                className="text-sm text-white/40 hover:text-white transition-colors"
              >
                View All
              </NavLink>

            </div>

            <div className="grid sm:grid-cols-2 gap-5">

              {related.map((relatedPost) => (

                <NavLink
                  key={relatedPost.slug}
                  to={`/blog/${relatedPost.slug}`}
                  className="card p-5 group border border-white/5 hover:border-accent/40 hover:-translate-y-1 transition-all duration-300"
                >

                  <span className="text-accent-soft text-xs">
                    {relatedPost.tag}
                  </span>

                  <h3 className="font-semibold text-lg leading-snug mt-2 mb-4 group-hover:text-accent-soft transition-colors">
                    {relatedPost.title}
                  </h3>

                  <span className="inline-flex items-center gap-1 text-xs text-white/40 group-hover:text-accent-soft transition-colors">
                    Read Lesson
                    <ArrowRight size={13} />
                  </span>

                </NavLink>

              ))}

            </div>

          </section>

        )}

        {/* CTA */}
        <div
          className="relative isolate overflow-hidden rounded-3xl mt-12 p-7 sm:p-9 text-center border-0"
          style={{
            backgroundImage: `linear-gradient(rgba(15,18,45,0.45), rgba(15,18,45,0.70)), url(${youWantLearn})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="relative z-10">

            <div className="w-11 h-11 mx-auto mb-4 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
              <Sparkles
                size={20}
                className="text-accent"
              />
            </div>

            <h2 className="text-2xl font-bold mb-2 text-white">
              AI Video Creation Seekhna Hai?
            </h2>

            <p className="text-white/80 max-w-xl mx-auto mb-6">
              AI video creation, prompting, storytelling,
              image-to-video, editing aur content strategy
              ko step-by-step seekhiye.
            </p>

            <NavLink
              to="/contact"
              className="btn-primary inline-flex items-center gap-2"
            >
              Start Learning
              <ArrowRight size={16} />
            </NavLink>

          </div>
        </div>

      </article>
    </div>
  )
}