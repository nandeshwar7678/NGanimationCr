
import React from "react";
import { useNavigate } from "react-router-dom";
const courses = [
  {
    id: 1,
    title: "AI Video Creation",
    category: "Artificial Intelligence",
    level: "Beginner",
    duration: "6 Weeks",
    price: "₹999",
    description:
      "Learn to create professional AI videos, animations and cinematic content.",
    icon: "🎬",
  },
  {
    id: 2,
    title: "AI Animation Masterclass",
    category: "Animation",
    level: "Beginner",
    duration: "8 Weeks",
    price: "₹1,499",
    description:
      "Learn AI animation, character design and storytelling.",
    icon: "🎨",
  },
  {
    id: 3,
    title: "Instagram Reels Creation",
    category: "Content Creation",
    level: "Beginner",
    duration: "4 Weeks",
    price: "₹799",
    description:
      "Create engaging reels with editing, hooks and creative ideas.",
    icon: "📱",
  },
];

export default function Courses() {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="px-6 py-20 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[4px] text-purple-400">
          NGAnimationCR Academy
        </p>

        <h1 className="text-4xl font-bold md:text-6xl">
          Learn. Create. <span className="text-purple-400">Grow.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-slate-300">
          Learn practical skills with expert-designed recorded courses.
          Learn anytime, anywhere and build your creative future.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Explore Our Courses</h2>
          <p className="mt-2 text-slate-400">
            Choose a course and start learning today.
          </p>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 transition duration-300 hover:-translate-y-2 hover:border-purple-500"
            >
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-950">
                <span className="text-7xl">{course.icon}</span>
              </div>

              <div className="p-6">
                <p className="text-sm font-medium text-purple-400">
                  {course.category}
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  {course.title}
                </h3>

                <p className="mt-3 min-h-16 text-sm leading-6 text-slate-400">
                  {course.description}
                </p>

                <div className="mt-5 flex justify-between text-sm text-slate-300">
                  <span>{course.level}</span>
                  <span>{course.duration}</span>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-700 pt-5">
                  <span className="text-2xl font-bold text-white">
                    {course.price}
                  </span>

                  <button
                    onClick={() => navigate(`/courses/${course.id === 1 ? "ai-video-creation" : course.id === 2 ? "ai-animation-masterclass" : "instagram-reels-creation"}`)}>
                    View Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
