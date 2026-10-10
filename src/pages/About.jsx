
import { NavLink } from 'react-router-dom';
import {
  Clapperboard,
  BookOpen,
  Lightbulb,
  Youtube,
  Heart,
} from 'lucide-react';

import creatorImg from '../assets/aboutcreator.jpg';

const CHANNEL_URL = 'https://www.youtube.com/@nganimationcr';

const pillars = [
  { icon: Clapperboard, name: 'Animation' },
  { icon: BookOpen, name: 'Storytelling' },
  { icon: Lightbulb, name: 'Creative Ideas' },
  { icon: Youtube, name: 'Entertainment' },
];

const journey = [
  { value: '4+', label: 'Years Experience' },
  { value: '250+', label: 'Projects' },
  { value: '80+', label: 'Happy Clients' },
  { value: '70M+', label: 'Total Views' },
];

const YELLOW = '#FFD23F';

const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Kaushan+Script&family=Caveat:wght@600;700&display=swap');

  .about-page {
    animation: aboutEnter 450ms ease-out both;
  }

  .brush-title {
    font-family: 'Kaushan Script', cursive;
  }

  .hand {
    font-family: 'Caveat', cursive;
  }

  .brush-btn {
    clip-path: polygon(
      2% 18%, 8% 6%, 30% 12%, 55% 4%,
      80% 10%, 97% 2%, 100% 30%, 96% 55%,
      99% 82%, 90% 96%, 65% 90%, 40% 98%,
      15% 92%, 3% 98%, 0% 70%, 3% 45%
    );
  }

  .hero-fade {
    -webkit-mask-image: linear-gradient(
      to right, transparent 0%, #000 28%
    );
    mask-image: linear-gradient(
      to right, transparent 0%, #000 28%
    );
  }

  @keyframes aboutEnter {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1023px) {
    .hero-fade {
      -webkit-mask-image: linear-gradient(
        to bottom, transparent 0%, #000 22%
      );
      mask-image: linear-gradient(
        to bottom, transparent 0%, #000 22%
      );
    }
  }

  @media (max-width: 640px) {
    .about-subscribe {
      padding: 1rem 1.5rem;
      font-size: 1.35rem;
      line-height: 1.35;
    }

    .about-tagline {
      gap: 0.5rem;
      letter-spacing: 0.12em;
      font-size: 0.7rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .about-page {
      animation: none;
    }

    .about-page *,
    .about-page *::before,
    .about-page *::after {
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
    }
  }
`;

export default function About() {
  return (
    <main className="about-page section-pad bg-[#0b0d12]">
      <style>{pageStyles}</style>

      <div className="container-x">

        {/* HERO SECTION */}
        <section className="relative grid lg:grid-cols-2 gap-6 items-center">

          <div className="relative z-10 min-w-0">

            <h1 className="brush-title italic leading-none text-6xl sm:text-7xl xl:text-8xl text-white -rotate-2 mb-2">
              About <span style={{ color: YELLOW }}>Me</span>
            </h1>

            <svg
              viewBox="0 0 400 20"
              className="w-64 sm:w-80 mb-8"
              aria-hidden="true"
            >
              <path
                d="M4 14 C 90 4, 220 4, 396 8"
                stroke={YELLOW}
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
              Hi, I'm Nganimationcr, a Content Creator
            </h2>

            <p className="text-white/80 text-lg leading-relaxed max-w-lg">
              I create engaging and creative videos that bring ideas,
              stories and emotions to life. From animation and
              storytelling to entertainment, this channel is my
              space to share what I love.
            </p>

            {/* CREATIVE PILLARS */}
            <ul className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-y-6 max-w-xl">
              {pillars.map(({ icon: Icon, name }, index) => (
                <li
                  key={name}
                  className={`flex flex-col items-center gap-2 text-center text-sm font-medium text-white px-2 ${
                    index > 0 ? 'sm:border-l sm:border-white/15' : ''
                  }`}
                >
                  <Icon
                    size={34}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    style={{
                      color: name === 'Entertainment' ? '#ff2d2d' : YELLOW,
                    }}
                  />

                  <span>{name}</span>
                </li>
              ))}
            </ul>

            {/* SUBSCRIBE BUTTON */}
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="brush-btn about-subscribe hand inline-flex items-center justify-center gap-3 mt-10 px-10 py-6 text-2xl sm:text-3xl font-bold text-[#0b0d12] -rotate-2 hover:rotate-0 hover:scale-[1.02] transition-transform duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              style={{ background: YELLOW }}
            >
              <span>Subscribe and Be Part of This Journey</span>
              <Heart
                size={24}
                fill="currentColor"
                className="shrink-0"
                aria-hidden="true"
              />
            </a>

          </div>

          {/* CREATOR IMAGE */}
          <div className="relative -mx-4 lg:mx-0 lg:-mr-8 xl:-mr-16">
            <img
              src={creatorImg}
              alt="Creator editing a video at night with a laptop and camera on the desk"
              className="hero-fade block w-full h-auto rounded-2xl"
              decoding="async"
              fetchPriority="high"
            />
          </div>

        </section>

        {/* TAGLINE */}
        <p className="about-tagline flex items-center justify-center gap-4 mt-14 text-white/60 tracking-[0.25em] text-sm">
          <span className="h-px w-12 shrink-0 bg-white/30" />

          DREAM
          <span className="text-white/30">|</span>
          CREATE
          <span className="text-white/30">|</span>
          SHARE

          <span className="h-px w-12 shrink-0 bg-white/30" />
        </p>

        {/* MY JOURNEY */}
        <section className="mt-20 grid lg:grid-cols-12 gap-8 items-center">

          <div className="lg:col-span-5">

            <h3
              className="hand text-4xl font-bold mb-3"
              style={{ color: YELLOW }}
            >
              My Journey
            </h3>

            <p className="text-white/60 leading-relaxed max-w-md">
              I started as a passionate creator and grew into a
              full-time one, working with brands and businesses on
              content that inspires, entertains and makes a difference.
            </p>

            <NavLink
              to="/contact"
              className="inline-flex items-center gap-2 mt-6 text-sm text-white/80 underline underline-offset-4 hover:text-white transition-colors duration-200"
            >
              Let's Work Together
            </NavLink>

          </div>

          {/* STATS */}
          <dl className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 border-y border-white/10 sm:divide-x divide-white/10">

            {journey.map(({ value, label }) => (
              <div
                key={label}
                className="py-6 px-4 sm:first:pl-0"
              >
                <dd className="font-bold text-3xl text-white">
                  {value}
                </dd>

                <dt className="text-white/50 text-sm mt-1">
                  {label}
                </dt>
              </div>
            ))}

          </dl>

        </section>

        {/* CREATOR QUOTE */}
        <blockquote
          className="hand text-3xl sm:text-4xl text-white/80 mt-16 max-w-2xl border-l-4 pl-5"
          style={{ borderColor: YELLOW }}
        >
          "Good stories don't just tell, they connect."

          <footer className="block text-base text-white/40 mt-1">
            Nganimationcr
          </footer>
        </blockquote>

      </div>
    </main>
  );
}