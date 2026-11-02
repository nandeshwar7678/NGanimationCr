
import { useEffect, useState } from "react";
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

const courseCategories = {
  "ai-video-creation": "Artificial Intelligence",
  "ai-animation-masterclass": "Animation",
  "instagram-reels-creation": "Content Creation",
};

const courseIcons = {
  "ai-video-creation": "🎬",
  "ai-animation-masterclass": "🎨",
  "instagram-reels-creation": "📱",
};

export default function CourseDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchCourseData = async () => {
      setLoading(true);
      setLessonsLoading(true);
      setError("");
      setCourse(null);
      setLessons([]);

      // Fetch course details
      try {
        const response = await fetch("/api/courses/list.php");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error("Unable to load course details.");
        }

        const foundCourse = (data.courses || []).find(
          (item) => item.slug === slug
        );

        if (!cancelled) {
          if (foundCourse) {
            setCourse(foundCourse);
          } else {
            setError("Course not found or currently unavailable.");
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load course details. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }

      // Fetch lessons from MySQL API
      try {
        const response = await fetch(
          `/api/courses/lessons.php?slug=${encodeURIComponent(slug)}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error("Unable to load lessons.");
        }

        if (!cancelled) {
          setLessons(data.lessons || []);
        }
      } catch (err) {
        if (!cancelled) {
          setLessons([]);
          console.error("Lessons loading error:", err);
        }
      } finally {
        if (!cancelled) {
          setLessonsLoading(false);
        }
      }
    };

    fetchCourseData();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading course details...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
        <h1 className="text-3xl font-bold">Course Unavailable</h1>

        <p className="mt-4 text-slate-400">
          {error || "This course could not be found."}
        </p>

        <button
          onClick={() => navigate("/courses")}
          className="mt-6 rounded-lg bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const category = courseCategories[course.slug] || "Online Course";
  const icon = courseIcons[course.slug] || "🎓";

  const handleEnroll = () => {
    alert("Payment integration will be connected in the next step.");
  };

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
                {category}
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
                  {lessonsLoading ? "Loading..." : `${lessons.length} Lessons`}
                </span>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-5">
                <span className="text-4xl font-bold">
                  {formatPrice(course.price)}
                </span>

                <button
                  onClick={handleEnroll}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-7 py-4 font-bold transition hover:bg-purple-700"
                >
                  <ShoppingCart size={19} />
                  Enroll Now
                </button>
              </div>
            </div>

            <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-800/40 to-indigo-900/40">
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="h-full max-h-[420px] w-full object-cover"
                />
              ) : (
                <span className="text-[130px]">{icon}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold">What You Will Learn</h2>

          <p className="mt-3 text-slate-400">
            Explore the topics included in this course.
          </p>

          {lessonsLoading ? (
            <p className="mt-6 text-slate-400">
              Loading course lessons...
            </p>
          ) : lessons.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4"
                >
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-purple-400"
                  />

                  <div>
                    <h3 className="font-medium text-slate-200">
                      {lesson.title}
                    </h3>

                    {lesson.description && (
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {lesson.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5 text-slate-400">
              Course topics will be announced soon.
            </p>
          )}
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
              {lessonsLoading ? "Loading..." : `${lessons.length} Learning Lessons`}
            </li>

            <li className="flex items-center gap-3">
              <CheckCircle2 size={18} />
              Practical Learning
            </li>
          </ul>

          <div className="mt-8 border-t border-slate-700 pt-6">
            <p className="text-sm text-slate-400">Course Price</p>

            <p className="mt-2 text-3xl font-bold">
              {formatPrice(course.price)}
            </p>

            <button
              onClick={handleEnroll}
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
