
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Clock,
  BookOpen,
  BarChart3,
  CheckCircle2,
  PlayCircle,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";

const courseData = {
  "ai-video-creation": {
    title: "AI Video Creation",
    category: "Artificial Intelligence",
    level: "Beginner",
    duration: "6 Weeks",
    price: 999,
    icon: "🎬",
    description:
      "Learn how to create professional AI videos, cinematic animations and engaging social media content. This course is designed for beginners who want to start their AI video creation journey.",
    lessons: [
      "Introduction to AI Video Creation",
      "AI Tools and Their Uses",
      "Writing Effective AI Prompts",
      "AI Image Generation",
      "Image to Video Animation",
      "Character Consistency",
      "AI Voice and Lip Sync",
      "Cinematic Video Editing",
      "Social Media Reels Creation",
      "Final Practical Project",
    ],
  },
  "ai-animation-masterclass": {
    title: "AI Animation Masterclass",
    category: "Animation",
    level: "Beginner",
    duration: "8 Weeks",
    price: 1499,
    icon: "🎨",
    description:
      "Learn AI animation, character design, storytelling and cinematic visual creation through practical lessons.",
    lessons: [
      "Animation Fundamentals",
      "AI Character Design",
      "Character Consistency",
      "Scene Creation",
      "AI Animation Tools",
      "Character Movement",
      "Storytelling",
      "Final Animation Project",
    ],
  },
  "instagram-reels-creation": {
    title: "Instagram Reels Creation",
    category: "Content Creation",
    level: "Beginner",
    duration: "4 Weeks",
    price: 799,
    icon: "📱",
    description:
      "Learn to create engaging Instagram Reels with creative ideas, editing techniques, hooks and storytelling.",
    lessons: [
      "Introduction to Reels",
      "Finding Content Ideas",
      "Writing Short Scripts",
      "Video Recording Basics",
      "Editing Techniques",
      "Hooks and Captions",
      "Hashtags and SEO",
      "Final Reel Project",
    ],
  },
};

export default function CourseDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const course = courseData[slug];

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-24 text-center text-white">
        <h1 className="text-3xl font-bold">Course Not Found</h1>
        <button
          onClick={() => navigate("/courses")}
          className="mt-6 rounded-lg bg-purple-600 px-6 py-3"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="bg-gradient-to-br from-purple-950 via-slate-950 to-indigo-950 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <button
            onClick={() => navigate("/courses")}
            className="mb-10 flex items-center gap-2 text-sm text-slate-300 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Courses
          </button>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-4 font-semibold text-purple-400">
                {course.category}
              </p>

              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                {course.title}
              </h1>

              <p className="mt-6 max-w-xl leading-7 text-slate-300">
                {course.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <Clock size={18} />
                  {course.duration}
                </span>

                <span className="flex items-center gap-2">
                  <BarChart3 size={18} />
                  {course.level}
                </span>

                <span className="flex items-center gap-2">
                  <BookOpen size={18} />
                  {course.lessons.length} Lessons
                </span>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-5">
                <span className="text-4xl font-bold">
                  ₹{course.price}
                </span>

                <button
                  onClick={() =>
                    alert("Enrollment and payment will be connected in the next step.")
                  }
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-7 py-4 font-bold transition hover:bg-purple-700"
                >
                  <ShoppingCart size={19} />
                  Enroll Now
                </button>
              </div>
            </div>

            <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-purple-800/40 to-indigo-900/40">
              <span className="text-[130px]">{course.icon}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold">
            What You Will Learn
          </h2>

          <p className="mt-3 text-slate-400">
            Explore the topics included in this course.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {course.lessons.map((lesson, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4"
              >
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-purple-400"
                />
                <span className="text-slate-200">{lesson}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <PlayCircle size={25} className="text-purple-400" />
            <h3 className="text-xl font-bold">Course Includes</h3>
          </div>

          <ul className="mt-6 space-y-5 text-sm text-slate-300">
            <li className="flex items-center gap-3">
              <PlayCircle size={18} />
              Recorded Video Lessons
            </li>
            <li className="flex items-center gap-3">
              <Clock size={18} />
              Lifetime Access
            </li>
            <li className="flex items-center gap-3">
              <BookOpen size={18} />
              {course.lessons.length} Learning Lessons
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 size={18} />
              Practical Learning
            </li>
          </ul>

          <div className="mt-8 border-t border-slate-700 pt-6">
            <p className="text-sm text-slate-400">Course Price</p>
            <p className="mt-2 text-3xl font-bold">₹{course.price}</p>

            <button
              onClick={() =>
                alert("Payment integration will be added next.")
              }
              className="mt-5 w-full rounded-xl bg-purple-600 py-4 font-bold hover:bg-purple-700"
            >
              Enroll Now
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}
