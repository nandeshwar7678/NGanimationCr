import { useParams, NavLink } from 'react-router-dom'
import { posts } from './Blog.jsx'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'

export default function BlogDetail() {
  const { slug } = useParams()

  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="section-pad">
        <div className="container-x max-w-3xl text-center py-20">

          <h1 className="text-3xl font-bold mb-3">
            Article Not Found
          </h1>

          <p className="text-white/50 mb-6">
            The article you are looking for does not exist.
          </p>

          <NavLink
            to="/blog"
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Blog
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

        {/* Back */}
        <NavLink
          to="/blog"
          className="inline-flex items-center gap-2 text-white/45 text-sm mb-8 hover:text-white transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Blog
        </NavLink>

        {/* Header */}
        <div className="max-w-3xl mb-10">

          <p className="text-accent-soft text-sm font-medium mb-4">
            {post.tag}
          </p>

          <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-5">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-white/40 text-sm">

            <span>
              {post.date}
            </span>

            <span className="w-1 h-1 rounded-full bg-white/20" />

            <span className="inline-flex items-center gap-1">
              <Clock size={14} />
              {post.read}
            </span>

          </div>

        </div>

        {/* Hero Image */}
        <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 mb-12 bg-white/5">

          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />

        </div>

        {/* Article */}
        <div className="max-w-3xl">

          {post.body.map((section, index) => (
            <section
              key={index}
              className="mb-10"
            >

              <h2 className="text-2xl font-semibold mb-4">
                {section.heading}
              </h2>

              <p className="text-white/65 leading-8 text-base sm:text-lg">
                {section.text}
              </p>

            </section>
          ))}

        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-12" />

        {/* Related Posts */}
        {related.length > 0 && (
          <section>

            <div className="flex items-end justify-between mb-5">

              <div>
                <p className="text-accent-soft text-xs mb-1">
                  KEEP READING
                </p>

                <h2 className="text-2xl font-bold">
                  Related Articles
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
                  className="card overflow-hidden group hover:border-accent/40 transition-all"
                >

                  <div className="aspect-video overflow-hidden">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-5">

                    <p className="text-accent-soft text-xs mb-2">
                      {relatedPost.tag}
                    </p>

                    <h3 className="font-semibold leading-snug mb-3">
                      {relatedPost.title}
                    </h3>

                    <span className="inline-flex items-center gap-1 text-xs text-white/40 group-hover:text-accent-soft transition-colors">
                      Read Article
                      <ArrowRight size={13} />
                    </span>

                  </div>

                </NavLink>
              ))}

            </div>

          </section>
        )}

        {/* Bottom CTA */}
        <div className="card mt-14 p-8 sm:p-10 text-center bg-gradient-to-br from-accent/15 to-transparent">

          <h2 className="text-2xl font-bold mb-2">
            Have a video project in mind?
          </h2>

          <p className="text-white/45 mb-6">
            Let's turn your idea into a cinematic AI video.
          </p>

          <NavLink
            to="/contact"
            className="btn-primary inline-flex items-center gap-2"
          >
            Start a Project
            <ArrowRight size={16} />
          </NavLink>

        </div>

      </article>
    </div>
  )
}