
import { Link } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "AI Video Creation",
    description: "Learn AI video generation and cinematic editing.",
    icon: "🎬",
    progress: 0,
    slug: "ai-video-creation",
  },
  {
    id: 2,
    title: "AI Animation Masterclass",
    description: "Learn AI animation and character design.",
    icon: "🎨",
    progress: 0,
    slug: "ai-animation-masterclass",
  },
];

export default function MyLearning() {
  return (
    <div className="min-h-screen bg-slate-950 px-5 py-14 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <p className="font-semibold uppercase tracking-widest text-purple-400">
            NGAnimationCR Academy
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            My Learning
          </h1>

          <p className="mt-3 text-slate-400">
            Continue learning and improve your creative skills.
          </p>
        </div>

        <div className="mb-10 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">My Courses</p>
            <h2 className="mt-3 text-3xl font-bold">0</h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Completed Courses</p>
            <h2 className="mt-3 text-3xl font-bold">0</h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Learning Status</p>
            <h2 className="mt-3 text-xl font-bold text-purple-400">
              Ready to Start
            </h2>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Available Courses</h2>

          <Link
            to="/courses"
            className="rounded-lg bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-700"
          >
            Explore Courses
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <div
              key={course.id}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
            >
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-950">
                <span className="text-7xl">{course.icon}</span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold">{course.title}</h3>

                <p className="mt-3 text-sm text-slate-400">
                  {course.description}
                </p>

                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span>{course.progress}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-purple-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <Link
                  to={`/courses/${course.slug}`}
                  className="mt-6 block rounded-lg border border-purple-500 px-5 py-3 text-center font-semibold text-purple-300 transition hover:bg-purple-600 hover:text-white"
                >
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-amber-300">
          Demo dashboard: purchased-course access will be connected after the backend and payment setup.
        </p>
      </div>
    </div>
  );
}
