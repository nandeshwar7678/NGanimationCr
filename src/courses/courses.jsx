
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const courseIcons = {
  "ai-video-creation": "🎬",
  "ai-animation-masterclass": "🎨",
  "instagram-reels-creation": "📱",
};

const courseCategories = {
  "ai-video-creation": "Artificial Intelligence",
  "ai-animation-masterclass": "Animation",
  "instagram-reels-creation": "Content Creation",
};

export default function Courses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses/list.php");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load courses.");
        }

        setCourses(data.courses || []);
      } catch (err) {
        setError("Courses load nahi ho paaye. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Hero Section */}
      <section className="px-6 py-16 text-center">
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

      {/* Courses Section */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Explore Our Courses</h2>
          <p className="mt-2 text-slate-400">
            Choose a course and start learning today.
          </p>
        </div>

        {loading && (
          <p className="py-10 text-center text-slate-300">
            Loading courses...
          </p>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center">
            <p className="text-red-300">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-purple-600 px-5 py-2 font-semibold hover:bg-purple-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <p className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-300">
            No courses are available right now. Please check back later.
          </p>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 transition duration-300 hover:-translate-y-2 hover:border-purple-500"
              >
                <div className="flex h-44 items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-950">
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-7xl">
                      {courseIcons[course.slug] || "🎓"}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-sm font-medium text-purple-400">
                    {courseCategories[course.slug] || "Online Course"}
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    {course.title}
                  </h3>

                  <p className="mt-3 min-h-16 text-sm leading-6 text-slate-400">
                    {course.description}
                  </p>

                  <div className="mt-5 flex justify-between gap-3 text-sm text-slate-300">
                    <span>{course.level}</span>
                    <span>{course.duration}</span>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-700 pt-5">
                    <span className="text-2xl font-bold text-white">
                      {formatPrice(course.price)}
                    </span>

                    <button
                      onClick={() => navigate(`/courses/${course.slug}`)}
                      className="rounded-lg bg-purple-600 px-4 py-2 font-semibold transition hover:bg-purple-700"
                    >
                      View Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
