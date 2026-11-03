import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MyLearning() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMyLearning = async () => {
      try {
        // Check login
        const userResponse = await fetch("/api/auth/me.php", {
          method: "GET",
          credentials: "include",
        });

        const userData = await userResponse.json();

        if (!userResponse.ok || !userData.success) {
          navigate("/login", { replace: true });
          return;
        }

        setUser(userData.user);

        // Load enrolled courses
        const courseResponse = await fetch(
          "/api/courses/my-courses.php",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const courseData = await courseResponse.json();

        if (!courseResponse.ok || !courseData.success) {
          throw new Error(
            courseData.message || "Unable to load your courses."
          );
        }

        setCourses(
          Array.isArray(courseData.courses)
            ? courseData.courses
            : []
        );
   
      } catch (err) {
        setError(
          err.message || "Unable to connect to server. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMyLearning();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout.php", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Logout failed.");
        return;
      }

      navigate("/login", { replace: true });
    } catch (err) {
      setError("Unable to logout. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p>Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-slate-950 px-5 text-white">
        <p className="text-center text-red-300">{error}</p>

        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-14 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="font-semibold uppercase tracking-widest text-purple-400">
              NGAnimationCR Academy
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              My Learning
            </h1>

            <p className="mt-3 text-slate-400">
              Welcome back, {user.name}!
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {user.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-red-500/50 px-5 py-3 font-semibold text-red-300 transition hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              My Courses
            </p>
        
            <h2 className="mt-3 text-3xl font-bold text-purple-400">
              {courses.length}
            </h2>
           
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Completed Courses
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              0
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Learning Status
            </p>

            <h2 className="mt-3 text-xl font-bold text-purple-400">
              {courses.length > 0 ? "Learning Active" : "Ready to Start"}
            </h2>
          </div>
        </div>

        {/* Course Heading */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              My Purchased Courses
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Access all your enrolled courses from here.
            </p>
          </div>

          <Link
            to="/courses"
            className="rounded-lg bg-purple-600 px-5 py-3 font-semibold transition hover:bg-purple-700"
          >
            Explore Courses
          </Link>
        </div>

        {/* Course List */}
        {courses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:-translate-y-1 hover:border-purple-500/50"
              >
                {/* Thumbnail */}
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-purple-700 to-slate-900 text-6xl">
                    🎓
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                      Enrolled
                    </span>

                    {course.level && (
                      <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-300">
                        {course.level}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold">
                    {course.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                    {course.description || "Start learning this course today."}
                  </p>

                  <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
                    <span>
                      ⏱ {course.duration || "Self-paced"}
                    </span>

                    <span className="text-green-400">
                      ✓ Purchased
                    </span>
                  </div>

                  <Link
                    to={`/courses/${course.slug}`}
                    className="mt-6 block rounded-lg bg-purple-600 px-5 py-3 text-center font-semibold transition hover:bg-purple-700"
                  >
                    Continue Learning →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <div className="text-5xl">🎓</div>

            <h3 className="mt-5 text-xl font-bold">
              Your Learning Journey Starts Here
            </h3>

            <p className="mt-3 text-sm text-slate-400">
              You haven't enrolled in any courses yet.
              Explore our courses and start learning.
            </p>

            <Link
              to="/courses"
              className="mt-6 inline-block rounded-lg bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700"
            >
              Browse Courses
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}