import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import learningBg from '../assets/blog/learningcover.jpg'
import youWantLearn from '../assets/blog/youWantLearn.jpg'
import {
  ArrowRight,
  Clock,
  Search,
  Sparkles,
  BookOpen,
  Youtube,
  Instagram,
  Facebook,
  Wand2,
  PlayCircle,
} from 'lucide-react'

import blog1 from '../assets/blog/1.png'
import blog2 from '../assets/blog/2.png'
import blog3 from '../assets/blog/3.png'
import blog4 from '../assets/blog/4.png'
import blog5 from '../assets/blog/5.png'
import blog6 from '../assets/blog/6.png'
import blog7 from '../assets/blog/7.png'
import blog8 from '../assets/blog/8.png'
import blog9 from '../assets/blog/9.png'
import blog10 from '../assets/blog/10.png'
import blog11 from '../assets/blog/11.png'
import blog12 from '../assets/blog/12.png'
import blog13 from '../assets/blog/13.png'
import blog14 from '../assets/blog/14.png'

export const posts = [
  {
    slug: 'ai-video-complete-a-to-z-guide',
    title: 'AI Video Kaise Banaye? Complete A to Z Workflow',
    date: 'Oct 08, 2026',
    read: '10 min read',
    tag: 'AI Video',
    // level: 'Beginner',
    icon: Wand2,
    image: blog1,
    excerpt:
      'Idea se lekar script, prompt, image generation, image-to-video, voice-over, editing aur final upload tak complete AI video workflow samjhiye.',
    body: [
      {
        heading: 'AI Video banane ka complete workflow',
        text:
          'Ek professional AI video sirf ek prompt se nahi banta. Pehle idea decide kiya jata hai, phir audience aur niche ke according concept develop hota hai. Uske baad script, scene breakdown, image prompts, video prompts, voice-over, sound design aur editing ka workflow follow kiya jata hai.',
      },
      {
        heading: 'Step 1 — Idea aur Niche',
        text:
          'Sabse pehle decide karein ki aap kis audience ke liye content bana rahe hain. Example: AI stories, kids stories, emotional stories, AI tutorials, advertisements ya cinematic videos.',
      },
      {
        heading: 'Step 2 — Script',
        text:
          'Script ko scenes me divide karein. Har scene me character, location, action, emotion aur dialogue clear rakhein.',
      },
      {
        heading: 'Step 3 — Image Generation',
        text:
          'Har scene ke liye detailed image prompt likhein. Character ka face, clothes, hair, age, environment aur visual style consistent rakhein.',
      },
      {
        heading: 'Step 4 — Image to Video',
        text:
          'Generated image ko video generation tool me use karein. Prompt me camera movement, character movement, facial expression aur environment motion specify karein.',
      },
      {
        heading: 'Step 5 — Voice and Editing',
        text:
          'Voice-over ke saath background music, sound effects, transitions aur subtitles add karein. Final video ko platform ke required format me export karein.',
      },
      {
        heading: 'Simple Formula',
        text:
          'IDEA → SCRIPT → SCENE BREAKDOWN → IMAGE PROMPT → IMAGE → VIDEO PROMPT → VIDEO → VOICE → EDITING → THUMBNAIL → UPLOAD → ANALYTICS.',
      },
    ],
  },

  {
    slug: 'how-to-write-ai-image-prompts',
    title: 'AI Image Prompt Kaise Likhein? Beginner to Advanced Guide',
    date: 'Oct 07, 2026',
    read: '8 min read',
    tag: 'Prompting',
    // level: 'Beginner',
    icon: Sparkles,
    image: blog2,
    excerpt:
      'AI image generation ke liye strong prompts kaise likhein aur character, location, lighting aur camera ko control kaise karein.',
    body: [
      {
        heading: 'Prompt kya hota hai?',
        text:
          'Prompt wo instruction hai jo aap AI image generator ko dete hain. Jitna clear aap subject, environment, camera, lighting aur style describe karenge, utna predictable result mil sakta hai.',
      },
      {
        heading: 'Prompt ka basic structure',
        text:
          'Subject + Appearance + Clothing + Environment + Action + Camera Angle + Lighting + Mood + Visual Style + Quality ko ek structured prompt me combine karein.',
      },
      {
        heading: 'Character consistency',
        text:
          'Agar same character multiple scenes me use karna hai to face structure, hair, skin tone, clothes, accessories aur proportions ko har prompt me consistently describe karein.',
      },
      {
        heading: 'Camera aur lighting',
        text:
          'Wide shot, medium shot, close-up, low angle, high angle, tracking shot, cinematic lighting, soft light aur rim light jaise terms visual direction ko clearer bana sakte hain.',
      },
    ],
  },

  {
    slug: 'image-to-video-ai-workflow',
    title: 'Image to Video AI: Ek Image Ko Cinematic Video Kaise Banaye',
    date: 'Oct 06, 2026',
    read: '7 min read',
    tag: 'AI Production',
    // level: 'Beginner',
    icon: PlayCircle,
    image: blog3,
    excerpt:
      'Static AI image ko cinematic moving shot me convert karne ka practical workflow.',
    body: [
      {
        heading: 'Image-to-video kya hai?',
        text:
          'Image-to-video workflow me ek existing image ko AI motion ke through video clip me convert kiya jata hai.',
      },
      {
        heading: 'Motion prompt kaise likhein?',
        text:
          'Sirf "make video" likhne ke bajay character action, camera movement aur environmental movement specify karein.',
      },
      {
        heading: 'Example workflow',
        text:
          'Image → Character movement → Camera movement → Facial expression → Environment movement → Generate → Check motion → Regenerate if needed → Edit.',
      },
      {
        heading: 'Common mistakes',
        text:
          'Bahut zyada movement ek saath dena, unclear camera direction aur character ke unwanted body movements common problems hain.',
      },
    ],
  },

  {
    slug: 'ai-character-consistency',
    title: 'AI Character Consistency Kaise Maintain Karein?',
    date: 'Oct 05, 2026',
    read: '8 min read',
    tag: 'AI Production',
    level: 'Intermediate',
    icon: Sparkles,
    image: blog4,
    excerpt:
      'Multiple scenes me same AI character ka face, clothes aur appearance consistent rakhne ka complete method.',
    body: [
      {
        heading: 'Consistency important kyun hai?',
        text:
          'Storytelling video me agar har scene me character ka face ya clothes change ho jaye to viewer ko story artificial lag sakti hai.',
      },
      {
        heading: 'Character reference banayein',
        text:
          'Ek master character image create karein aur us image ko future scenes ke reference ke roop me use karein.',
      },
      {
        heading: 'Character lock',
        text:
          'Face, hairstyle, skin tone, body proportions, clothing, accessories aur important visual identifiers ko lock karein.',
      },
      {
        heading: 'Scene workflow',
        text:
          'Master Character → Scene Description → Character Reference → Image Generation → Consistency Check → Image-to-Video.',
      },
    ],
  },

  {
    slug: 'ai-video-script-scene-breakdown',
    title: 'AI Video Ke Liye Script Aur Scene Breakdown Kaise Karein',
    date: 'Oct 04, 2026',
    read: '9 min read',
    tag: 'Storytelling',
    // level: 'Beginner',
    icon: BookOpen,
    image: blog5,
    excerpt:
      'Ek story ko scene-by-scene AI video production ke liye kaise convert karein.',
    body: [
      {
        heading: 'Story ko scenes me divide karein',
        text:
          'Har scene ka ek clear purpose hona chahiye. Scene me location, character, action, emotion, dialogue aur camera direction define karein.',
      },
      {
        heading: 'Scene template',
        text:
          'SCENE NUMBER → LOCATION → TIME → CHARACTER → ACTION → DIALOGUE → CAMERA → LIGHTING → SOUND → TRANSITION.',
      },
      {
        heading: 'Smooth transitions',
        text:
          'Ek scene se doosre scene me movement, camera direction, character action ya environmental element ko connect karne se storytelling smooth feel hoti hai.',
      },
    ],
  },

  {
    slug: 'how-to-choose-content-niche',
    title: 'YouTube, Instagram Aur Facebook Ke Liye Niche Kaise Choose Karein?',
    date: 'Oct 03, 2026',
    read: '7 min read',
    tag: 'Content Strategy',
    // level: 'Beginner',
    icon: Sparkles,
    image: blog6,
    excerpt:
      'Random content banane ke bajay ek clear niche aur content pillars kaise decide karein.',
    body: [
      {
        heading: 'Niche kya hota hai?',
        text:
          'Niche ek specific content area hai jiske around aap consistently content publish karte hain.',
      },
      {
        heading: 'AI creator ke liye example niches',
        text:
          'AI animation, AI tutorials, AI video tools, cinematic AI stories, AI advertisements, AI filmmaking aur AI content creation jaise niches choose kiye ja sakte hain.',
      },
      {
        heading: '3 Content Pillars',
        text:
          'Ek practical structure ho sakta hai: EDUCATE + ENTERTAIN + SHOWCASE. Educate me tutorials, entertain me stories/reels aur showcase me portfolio/client work.',
      },
      {
        heading: 'Niche ko test karein',
        text:
          'Ek topic ko kuch videos tak consistently test karein aur views ke saath retention, engagement aur returning viewers ko bhi compare karein.',
      },
    ],
  },

  {
    slug: 'youtube-long-video-strategy',
    title: 'YouTube Long Videos Strategy: Topic, Hook, Thumbnail Aur Upload Plan',
    date: 'Oct 02, 2026',
    read: '10 min read',
    tag: 'YouTube',
    level: 'Intermediate',
    icon: Youtube,
    image: blog7,
    excerpt:
      'Long-form YouTube videos ke liye topic selection, title, thumbnail, hook, retention aur analytics ka complete framework.',
    body: [
      {
        heading: 'Long video ka topic kaise choose karein?',
        text:
          'Aise topics choose karein jinke around audience ka real problem, curiosity ya desired result ho. YouTube Analytics ke Audience aur Trends data se ideas validate kiye ja sakte hain.',
      },
      {
        heading: 'First 30 seconds',
        text:
          'Video ke beginning me viewer ko quickly bataiye ki video me unhe kya milega. Long introduction ko avoid karke value ya curiosity se start karein.',
      },
      {
        heading: 'Thumbnail + Title',
        text:
          'Thumbnail ka kaam attention capture karna aur title ka kaam clear promise dena hai. Dono ek hi message ko repeat karne ke bajay complementary hone chahiye.',
      },
      {
        heading: 'Upload timing',
        text:
          'Koi universal magic upload time nahi hai. Starting test ke liye audience ke active hours me publish karein, phir YouTube Studio ke "When your viewers are on YouTube" report ke according schedule adjust karein.',
      },
      {
        heading: 'Analytics',
        text:
          'Impressions, CTR, average view duration, audience retention aur traffic sources ko compare karein. High CTR but low retention ka matlab packaging strong ho sakti hai lekin video delivery improve karni hogi.',
      },
    ],
  },

  {
    slug: 'youtube-shorts-strategy',
    title: 'YouTube Shorts Strategy: Hook Se Retention Tak',
    date: 'Oct 01, 2026',
    read: '7 min read',
    tag: 'YouTube',
    // level: 'Beginner',
    icon: Youtube,
    image: blog8,
    excerpt:
      'Short-form videos ke liye hook, pacing, captions, loop aur content ideas ka practical system.',
    body: [
      {
        heading: 'Short ka first moment',
        text:
          'Short me opening ko direct rakhein. Viewer ko immediately visual ya information-based reason mile ki woh video dekhta rahe.',
      },
      {
        heading: 'Fast storytelling',
        text:
          'Har second me unnecessary information bharna zaroori nahi hai. Story ko fast but understandable progression dein.',
      },
      {
        heading: 'Series strategy',
        text:
          'Ek successful topic ko multiple episodes me convert karein. Isse audience ko next video dekhne ka reason mil sakta hai.',
      },
      {
        heading: 'Analytics',
        text:
          'Views ke saath stayed-to-watch, retention, likes aur subscribers gained jaise signals ko compare karein.',
      },
    ],
  },

  {
    slug: 'instagram-reels-strategy',
    title: 'Instagram Reels Strategy: AI Creator Ke Liye Complete Plan',
    date: 'Sep 30, 2026',
    read: '9 min read',
    tag: 'Instagram',
    level: 'Intermediate',
    icon: Instagram,
    image: blog9,
    excerpt:
      'Instagram par AI videos, tutorials aur storytelling Reels ko systematically grow karne ka workflow.',
    body: [
      {
        heading: 'Instagram ke liye content pillars',
        text:
          'AI tutorials, before-after transformations, cinematic AI stories, tool tips aur portfolio/showcase ko content pillars banaya ja sakta hai.',
      },
      {
        heading: 'Reel format',
        text:
          'Vertical 9:16 format use karein aur important text ko safe area me rakhein. Meta ke Reels guidance me vertical creative, audio aur safe-zone placement ko important bataya gaya hai.',
      },
      {
        heading: 'Hook examples',
        text:
          'Examples: "Ye AI video sirf ek image se banayi hai", "Agar aap AI video banana seekhna chahte ho...", ya "Is prompt se character change hona band ho jayega."',
      },
      {
        heading: 'Posting time',
        text:
          'Ek fixed universal time par depend na karein. Starting experiment ke liye 12–2 PM aur 7–10 PM jaise windows test kar sakte hain, phir apne Instagram Insights ke actual audience activity data ke according schedule change karein.',
      },
      {
        heading: 'CTA',
        text:
          'Reel ke end me ek clear next action dein: Follow, Save, Comment, Share ya Full Tutorial ke liye profile/link visit karein.',
      },
    ],
  },

  {
    slug: 'facebook-content-strategy',
    title: 'Facebook Reels Aur Videos Strategy: AI Creator Ke Liye Guide',
    date: 'Sep 29, 2026',
    read: '8 min read',
    tag: 'Facebook',
    level: 'Intermediate',
    icon: Facebook,
    image: blog10,
    excerpt:
      'Facebook par Reels, long videos, posts aur cross-platform content ko kaise plan karein.',
    body: [
      {
        heading: 'Facebook par kya post karein?',
        text:
          'AI stories, short tutorials, before-after videos, educational clips, client work aur longer explanatory videos ko test kiya ja sakta hai.',
      },
      {
        heading: 'Facebook Reels',
        text:
          'Facebook Reels short-form content ke liye useful format hain. Public audience setting check karein agar aap wider reach chahte hain.',
      },
      {
        heading: 'Instagram se Facebook cross-posting',
        text:
          'Same core video ko platforms par reuse kiya ja sakta hai, lekin caption, CTA aur audience context ko platform ke according adjust karna better approach hai.',
      },
      {
        heading: 'Timing',
        text:
          'Starting test ke liye evening window use karein, lekin final schedule Page/Content Insights ke performance data se decide karein.',
      },
    ],
  },

  {
    slug: 'youtube-thumbnail-title-hook',
    title: 'YouTube Thumbnail, Title Aur Hook Ka Complete Formula',
    date: 'Sep 28, 2026',
    read: '8 min read',
    tag: 'YouTube',
    level: 'Intermediate',
    icon: Youtube,
    image: blog11,
    excerpt:
      'Thumbnail, title aur opening hook ko ek saath design karke video ka packaging kaise improve karein.',
    body: [
      {
        heading: 'Thumbnail ka objective',
        text:
          'Thumbnail ko small screen par bhi instantly understandable hona chahiye. Ek main subject, clear emotion/action aur limited text usually cleaner presentation dete hain.',
      },
      {
        heading: 'Title ka objective',
        text:
          'Title me viewer ko clear reason mile ki video kyu dekhna chahiye. Curiosity ke saath actual content ka promise match karna zaroori hai.',
      },
      {
        heading: 'Hook',
        text:
          'Hook video ke beginning me curiosity, result, problem ya surprising visual establish kar sakta hai.',
      },
      {
        heading: 'CTR aur retention',
        text:
          'YouTube Analytics me CTR aur retention ko saath me dekhein. Sirf click lana enough nahi hai; video ko promise deliver bhi karna chahiye.',
      },
    ],
  },

  {
    slug: 'ai-video-voiceover-editing',
    title: 'AI Video Me Voice-Over, Music, SFX Aur Editing Ka Workflow',
    date: 'Sep 27, 2026',
    read: '8 min read',
    tag: 'Editing',
    level: 'Intermediate',
    icon: PlayCircle,
    image: blog12,
    excerpt:
      'Raw AI clips ko professional storytelling video me convert karne ka editing workflow.',
    body: [
      {
        heading: 'Voice-over first',
        text:
          'Story-driven videos me voice-over ko timeline ka base bana kar visuals ko uske according arrange karna useful workflow ho sakta hai.',
      },
      {
        heading: 'Music',
        text:
          'Music story ke mood ko support kare. Dialogue ke important parts ke neeche music ko controlled rakhein.',
      },
      {
        heading: 'Sound effects',
        text:
          'Door, footsteps, wind, environment aur action-specific sound effects visual moments ko more immersive bana sakte hain.',
      },
      {
        heading: 'Final edit',
        text:
          'Unnecessary pauses remove karein, scene transitions smooth rakhein aur subtitles ko readable size me use karein.',
      },
    ],
  },

  {
    slug: 'content-calendar-for-ai-creators',
    title: 'AI Creator Ke Liye 30-Day Content Calendar Kaise Banaye',
    date: 'Sep 26, 2026',
    read: '9 min read',
    tag: 'Content Strategy',
    // level: 'Beginner',
    icon: BookOpen,
    image: blog13,
    excerpt:
      'YouTube, Instagram aur Facebook ke liye ek repeatable monthly content system.',
    body: [
      {
        heading: 'Content system',
        text:
          'Har din naya idea sochne ke bajay content pillars ke around weekly system banayein.',
      },
      {
        heading: 'Example weekly plan',
        text:
          'Monday: AI tutorial. Tuesday: Short tip. Wednesday: Story/Reel. Thursday: Tool tutorial. Friday: Portfolio/showcase. Saturday: Long-form video. Sunday: Analytics aur planning.',
      },
      {
        heading: 'One idea, multiple formats',
        text:
          'Ek long YouTube tutorial se multiple Shorts/Reels, carousel ideas, Facebook clips aur blog articles nikale ja sakte hain.',
      },
      {
        heading: 'Review',
        text:
          'Har week top-performing topics ko identify karein aur unke variations create karein.',
      },
    ],
  },

  {
    slug: 'social-media-analytics-for-creators',
    title: 'YouTube, Instagram Aur Facebook Analytics Kaise Samjhein',
    date: 'Sep 25, 2026',
    read: '10 min read',
    tag: 'Analytics',
    level: 'Intermediate',
    icon: BookOpen,
    image: blog14,
    excerpt:
      'Views ke peeche ka actual data samajhkar better content decisions kaise lein.',
    body: [
      {
        heading: 'Sirf views mat dekhiye',
        text:
          'Views useful hain, lekin audience retention, engagement, CTR, watch time aur returning viewers jaise metrics bhi important hain.',
      },
      {
        heading: 'YouTube',
        text:
          'YouTube Studio me Reach, Engagement, Audience aur Content reports ko compare karein. Audience report se aap dekh sakte hain ki viewers kab YouTube par active hote hain.',
      },
      {
        heading: 'Instagram',
        text:
          'Reel reach, watch behaviour, shares, saves, comments, follows aur profile activity ko compare karein.',
      },
      {
        heading: 'Facebook',
        text:
          'Page aur content insights ke through dekhein kaunsa format aur topic audience ke saath better perform kar raha hai.',
      },
      {
        heading: 'Decision formula',
        text:
          'GOOD TOPIC + GOOD PACKAGING + GOOD RETENTION + REPEATABLE FORMAT = CONTENT SYSTEM.',
      },
    ],
  },
]

const categoryIcons = {
  YouTube: Youtube,
  Instagram: Instagram,
  Facebook: Facebook,
  'AI Video': Wand2,
}

export default function Blog() {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('All')

  const tags = [
    'All',
    'AI Video',
    'Prompting',
    'AI Production',
    'Storytelling',
    'Content Strategy',
    'YouTube',
    'Instagram',
    'Facebook',
    'Editing',
    'Analytics',
  ]

  const filteredPosts = posts.filter((post) => {
    const searchText = search.toLowerCase()

    const matchesTag =
      activeTag === 'All' || post.tag === activeTag

    const matchesSearch =
      post.title.toLowerCase().includes(searchText) ||
      post.excerpt.toLowerCase().includes(searchText) ||
      post.tag.toLowerCase().includes(searchText)

    return matchesTag && matchesSearch
  })

  return (
    <div className="py-8 sm:py-10">
      <div className="container-x">

        {/* HERO */}
        <div
          className="relative isolate overflow-hidden rounded-3xl mb-8 p-7 sm:p-10 min-h-[200px] sm:min-h-[350px] flex items-center"
          style={{
            backgroundImage: `url(${learningBg})`,
            backgroundSize: 'cover',
            backgroundPosition: '60% center',

          }}
        >
          {/* Dark overlay for readable text */}
          <div className="absolute inset-0 -z-10 bg-black/45" />

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium mb-4">
              <Sparkles size={13} />
              NGanimationCr Learning Hub
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-4 text-white">
              Learn AI Video Creation
              <span className="block text-orange-300 mt-2">
                From Zero to Pro
              </span>
            </h1>

            <p className="text-white/90 leading-relaxed max-w-2xl">
              AI video creation, prompting, storytelling, editing,
              YouTube, Instagram, Facebook, thumbnails, hooks,
              content strategy and analytics — everything in one place.
            </p>
          </div>
        </div>
        {/* SEARCH */}
        <div className="relative max-w-lg mb-6">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search AI video, YouTube, Reels..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-accent/50 focus:bg-white/[0.07] transition-all"
          />

        </div>

        {/* CATEGORIES */}
        <div className="flex flex-wrap gap-2 mb-8">

          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`
                px-4 py-2 rounded-full text-sm
                border transition-all duration-300
                ${activeTag === tag
                  ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20'
                  : 'bg-white/[0.03] border-white/10 text-white/50 hover:text-white hover:border-accent/40 hover:bg-accent/10'
                }
              `}
            >
              {tag}
            </button>
          ))}

        </div>

        {/* RESULT COUNT */}
        <div className="flex items-center justify-between mb-5">

          <p className="text-sm text-white/40">
            {filteredPosts.length} learning articles
          </p>

          <span className="text-xs sm:text-sm font-extrabold tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hover:text-amber-300 transition-colors duration-300">
            Step-by-step practical guides
          </span>

        </div>

        {/* BLOG GRID */}
        {filteredPosts.length > 0 ? (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {filteredPosts.map((post) => {

              const Icon =
                categoryIcons[post.tag] ||
                post.icon ||
                BookOpen

              return (
                <NavLink
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group card overflow-hidden border border-white/5 hover:border-accent/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300"
                >


                  {/* IMAGE — Full image visible on desktop & mobile */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#111]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />

                    {/* Optional labels */}
                    <span className="absolute top-3 right-3 text-[11px] px-2.5 py-1 rounded-full bg-black/55 border border-white/10 text-white/80 backdrop-blur-md">
                      {post.level}
                    </span>

                    <span className="absolute bottom-3 left-3 text-xs font-medium text-white/90 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                      {post.tag}
                    </span>
                  </div>


                  {/* CONTENT */}
                  <div className="p-5">

                    <div className="flex items-center justify-between gap-3 mb-3">

                      <span className="inline-flex items-center gap-1.5 text-accent-soft text-xs font-medium">
                        <Icon size={13} />
                        {post.tag}
                      </span>

                      <span className="inline-flex items-center gap-1 text-white/30 text-xs">
                        <Clock size={12} />
                        {post.read}
                      </span>

                    </div>

                    <h2 className="font-semibold text-lg leading-snug mb-3 group-hover:text-accent-soft transition-colors">
                      {post.title}
                    </h2>

                    {/* <p className="text-white/45 text-sm leading-relaxed line-clamp-3 mb-5">
                      {post.excerpt}
                    </p> */}

                    <div className="flex items-center justify-between">

                      <span className="text-xs text-white/30">
                        {post.date}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs text-white/55 group-hover:text-accent-soft transition-colors">
                        Learn Now
                        <ArrowRight size={14} />
                      </span>

                    </div>

                  </div>

                </NavLink>
              )
            })}

          </div>

        ) : (

          <div className="text-center py-16">

            <Search
              size={35}
              className="mx-auto mb-4 text-white/20"
            />

            <h3 className="text-xl font-semibold mb-2">
              No learning article found
            </h3>

            <p className="text-white/40">
              Try another keyword or category.
            </p>

          </div>

        )}

        {/* BOTTOM CTA */}
        <div
        className="relative isolate overflow-hidden rounded-3xl mt-12 p-7 sm:p-9 text-center border-0"
          style={{
            backgroundImage: `linear-gradient(rgba(15,18,45,0.45), rgba(15,18,45,0.65)), url(${youWantLearn})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Sparkles
            size={24}
            className="mx-auto mb-3 text-accent"
          />

          <h2 className="text-2xl font-bold mb-2 text-white">
            Want to Learn AI Video Creation?
          </h2>

          <p className="text-white/80 text-sm max-w-xl mx-auto mb-5">
            Learn AI video creation, prompting, storytelling,
            editing and content strategy step by step.
          </p>

          <NavLink
            to="/contact"
            className="btn-primary inline-flex items-center gap-2"
          >
            Start Learning
            <ArrowRight size={15} />
          </NavLink>
        </div>

      </div>
    </div>
  )
}